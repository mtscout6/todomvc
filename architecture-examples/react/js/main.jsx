/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
(function() {
	var model = new app.TodoModel('react-todos');
	var TodoApp = app.TodoApp;

	function render() {
		React.renderComponent(
			<TodoApp model={model}/>,
			document.getElementById('todoapp')
		);
	}

	model.subscribe(render);
	render();
}());
