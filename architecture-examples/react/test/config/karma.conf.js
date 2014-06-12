module.exports = function (config) {
	'use strict';

	config.set({
		basePath: '../../',
		frameworks: ['jasmine'],
		preprocessors: {
			"**/*.jsx": ["react-jsx"]
		},
		files: [
			'bower_components/**/*.js',
			'js/utils.js',
			'js/todoModel.js',
			'js/todoItem.jsx',
			'js/footer.jsx',
			'js/app.jsx',
			'test/lib/**/*.js',
			'test/unit/**/*.js',
			'test/unit/**/*.jsx'
		],
		exclude: [
			'js/main.jsx',
			'bower_components/react/JSXTransformer.js'
		],
		autoWatch: true,
		singleRun: false,
		browsers: ['Chrome', 'Firefox']
	});
};
