/// <reference path="../../../typings/tsd.d.ts"/>

var conversationListDir = angular.module("RongWebIMWidget.conversationListDirective", ["RongWebIMWidget.conversationListController"]);

conversationListDir.directive("rongConversationList", [function() {

    return {
        restrict: "E",
        templateUrl: "./src/ts/conversationlist/conversationList.tpl.html",
        controller: "conversationListController",
        link: function(scope: any, ele: angular.IRootElementService) {
            $(ele).find(".content").niceScroll({
                'cursorcolor': "#0099ff",
                'cursoropacitymax': 1,
                'touchbehavior': false,
                'cursorwidth': "8px",
                'cursorborder': "0",
                'cursorborderradius': "5px"
            });
        }
    }
}]);

conversationListDir.directive("conversationItem", ["conversationServer", "conversationListServer", "RongIMSDKServer", function(conversationServer: ConversationServer, conversationListServer: conversationListServer, RongIMSDKServer: RongIMSDKServer) {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<div class="chatList">' +
        '<div class="chat_item " ng-class="{\'online\':item.onLine}">' +
        '<div class="ext">' +
        '<p class="attr clearfix">' +
        '<span class="badge" ng-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>' +
        '<i class="sprite no-remind" ng-click="remove($event)"></i>' +
        '</p>' +
        '</div>' +
        '<div class="photo">' +
        '<img class="img" ng-src="{{item.portraitUri}}" err-src="http://7xo1cb.com1.z0.glb.clouddn.com/20160230163460.jpg" alt="">' +
        '<i class="Presence Presence--stacked Presence--mainBox"></i>' +
        '</div>' +
        '<div class="info">' +
        '<h3 class="nickname">' +
        '<span class="nickname_text" title="{{item.title}}">{{item.title}}</span>' +
        '</h3>' +
        '</div>' +
        '</div>' +
        '</div>',
        link: function(scope, ele, attr) {
            ele.on("click", function() {
                conversationServer.onConversationChangged(new WidgetModule.Conversation(scope.item.targetType, scope.item.targetId, scope.item.title))
                RongIMLib.RongIMClient.getInstance().clearUnreadCount(scope.item.targetType, scope.item.targetId, {
                    onSuccess: function() {

                    },
                    onError: function() {

                    }
                })
                RongIMSDKServer.sendReadReceiptMessage(scope.item.targetId, Number(scope.item.targetType));
                conversationListServer.updateConversations();
            });

            scope.remove = function(e) {
                e.stopPropagation();

                RongIMLib.RongIMClient.getInstance().removeConversation(scope.item.targetType, scope.item.targetId, {
                    onSuccess: function() {
                        if (conversationServer.current.targetType == scope.item.targetType && conversationServer.current.targetId == scope.item.targetId) {
                            conversationServer.onConversationChangged(new WidgetModule.Conversation());
                        }
                        conversationListServer.updateConversations();
                    },
                    onError: function(error) {
                        console.log(error);
                    }
                });

            }
        }
    }
}]);
