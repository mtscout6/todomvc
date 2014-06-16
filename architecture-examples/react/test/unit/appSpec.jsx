/**
 * @jsx React.DOM
 */
/*global describe, it, beforeEach, inject, expect*/
(function () {
		'use strict';

		describe('App', function() {
			var ReactTestUtils = React.addons.TestUtils,
					model,
					instance,
					flag,
					TodoApp = app.TodoApp;

			beforeEach(function() {
				model = sinon.stub(new app.TodoModel("test-model"));

				instance = ReactTestUtils.renderIntoDocument(<TodoApp model={model} />);
			});

			afterEach(function() {
				if (instance && instance.isMounted()) {
					React.unmountComponentAtNode(instance.getDOMNode().parent);
				}

				location.hash = '/';
			});

			it('should define TodoApp', function() {
				expect(app.TodoApp).toBeTruthy();
			});

			it('should define default state', function() {
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

			it('pressing the enter key adds todo item and clears text field', function() {
				var itemText = "test item text";
				instance.refs.newField.getDOMNode().value = itemText;
				app.TodoApp.originalSpec.handleNewTodoKeyDown.bind(instance)({which: 13});

				expect(model.addTodo.calledWith(itemText)).toBe(true);
				expect(instance.refs.newField.getDOMNode().value).toBe('');
			});

			it('pressing other keys does nothing', function() {
				var itemText = "test item text",
						key = (function() {
							var n = 13;
							while (n === 13) n = Math.floor(Math.random() * 1000000);
							return n;
						}());

				instance.refs.newField.getDOMNode().value = itemText;
				app.TodoApp.originalSpec.handleNewTodoKeyDown.bind(instance)({which: key});

				expect(model.addTodo.calledWith(itemText)).toBe(false);
				expect(instance.refs.newField.getDOMNode().value).toBe(itemText);
			});

			for(flag in [true, false]) {
				it("toggles all items checked status when checked " + flag, function(){
					app.TodoApp.originalSpec.toggleAll.bind(instance)({target: { checked: flag }});
					expect(model.toggleAll.calledWith(flag)).toBe(true)
				});
			}

			it('can i mock a child component', function() {
				model.todos = [{
					id: app.Utils.uuid(),
					title: 'test',
					completed: false
				}];

				ReactTestUtils.mockComponent(app.TodoFooter)
			});

		});

}());
