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
					TodoApp = app.TodoApp,
			    mockFooter,
					mockComponent = function(component, mockTagName){
						var reactClass = React.createClass({
									render: function() {
										var mockTagName = mockTagName || "div";
										return React.DOM[mockTagName](null, this.props.children);
									}
								});
						var mock = sinon.stub(app, component, reactClass);

						//var original = app[component];
						//reactClass.restore = function() {
							//app[component] = original;
						//};

						//mock.returns(reactClass);
						return mock;

						//return reactClass;
					};

			beforeEach(function() {
				model = sinon.stub(new app.TodoModel("test-model"));

				mockFooter = mockComponent("TodoFooter");

				instance = ReactTestUtils.renderIntoDocument(<TodoApp model={model} />);
			});

			afterEach(function() {
				if (instance && instance.isMounted()) {
					React.unmountComponentAtNode(instance.getDOMNode().parent);
				}

				mockFooter.restore();

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

			it('renders footer when there are task items', function() {
				model.todos = [{
					id: app.Utils.uuid(),
					title: 'test',
					completed: false
				}];

				instance.setState({});

				var lastCall = mockFooter.lastCall.args[0];
				
				expect(lastCall.completedCount).toBe(0);
				expect(lastCall.count).toBe(1);
				expect(lastCall.nowShowing).toBe('all');
			});

			it('does not render footer when there are no task items', function() {
				expect(mockFooter.notCalled).toBe(true);
			});

		});

}());
