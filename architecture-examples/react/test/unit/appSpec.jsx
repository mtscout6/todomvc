/*global describe, it, beforeEach, inject, expect*/
(function () {
		'use strict';

		describe('App', function() {
			var ReactTestUtils = React.addons.TestUtils,
					model,
					instance;

			beforeEach(function() {
				model = new app.TodoModel("test-model");

				instance = ReactTestUtils.renderIntoDocument(app.TodoApp({model: model}));
			});

			afterEach(function() {
				if (instance && instance.isMounted()) {
					React.unmountComponentAtNode(instance.getDOMNode().parent);
				}

				location.hash = '/';
			});

			it('should define TodoApp', function(){
				expect(app.TodoApp).toBeTruthy();
			});

			it('should define default state', function(){
				expect(app.TodoApp.originalSpec.getInitialState()).toEqual({
					nowShowing: 'all',
					editing: null
				});
			});

			it('routing to /active changes state', function() {
				location.hash = "/";
				waitsFor(function() {
					return instance.state.nowShowing === app.ALL_TODOS;
				}, "is showing all", 10);

				location.hash = "/active";
				waitsFor(function() {
					return instance.state.nowShowing === app.ACTIVE_TODOS;
				}, "is showing active", 10);
			});

			it("pressing the enter key adds todo item and clears text field", function() {
				instance.refs.newField.getDOMNode().value = 'test';
				app.TodoApp.originalSpec.handleNewTodoKeyDown.bind(instance)({which: 13});

				expect(model.todos.length).toBe(1);
				expect(instance.refs.newField.getDOMNode().value).toBe('');
			});
		});

}());
