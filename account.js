define(function (require) {
  'use strict';
  var
    TemplateAccountIndex = require('hbs!../../templates/account/index'),
    Base = require('nagini/views/base'),
    browser = require('minotaur/lib/browser'),
    Models = require('arnold/models'),
    Labels = require('i18n!crete/nls/labels'),
    Chiropractor = require('chiropractor'),
    Arnold = require('arnold/app'),
    Matrix = require('matrix/app'),
    Notification = require('notification'),
    _ = require('underscore');

  return Base.extend({
    template: TemplateAccountIndex,
    events: {
      'click .company_select_heath_plan': 'selectHealthPlan',
      'click .save_account': 'saveButton',
      'click .password-reset-btn': 'changePassword',
      'click .arnold_logout': 'arnold_logout'
    },
    initialize: function (options) {
      this.account = options;
      Base.prototype.initialize.apply(this, arguments);
      this.context = {
        labels: Labels,
        account: this.account
      };
    },
    arnold_logout: function(e) {
      e.preventDefault(e);
      var that = this;
      if ($(e.currentTarget).attr('data-vtoken')) {
        Matrix.setCookie('vtoken','');
      }
      Arnold.logout(function(){
        location.reload();
      });
    },
    changePassword: function(){
      Chiropractor.Publish('account_reset_password');
    },
    saveModelSettings: function(e) {
      var
        that = this,
        healthPlanSelected = $(e.target).siblings('#account-health-plan').find('#health_plan option:selected').val(),
        feedback = $(e.target).siblings('#account-pref-sharing').find('.feedback-consent');

        that.healthPlanModel = new Models.HealthPlanSet({
          health_plan: healthPlanSelected
        });

        that.userModel = new Models.CompanyUserModel({
            "user_feedback_consent": feedback.prop('checked')
          });

      that.listenTo(that.healthPlanModel, 'refreshErrors', that.refreshErrors);
    },
    saveButton: function(e){
      e.preventDefault();
      var
        that = this;

      that.saveModelSettings(e);
      if (!that.healthPlanModel) {
        this.refreshErrors(that.model);
      } else {
        if (!that.healthPlanModel.get('health_plan')) {
          that.healthPlanModel.set('health_plan', null);
        }
        that.healthPlanModel.save({}, {
          headers: {'Authorization': Models.GlobalUser.get('auth_token')}
        });
      }
      that.userModel.save({}, {
        type: 'PUT',
        headers: {'Authorization': Models.GlobalUser.get('auth_token')}
      }).done(function () {
        Notification.notice({message: Labels.account.SavedMessage});
      });
    }
  });
});