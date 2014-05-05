module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        src: ['js/**/*.js', "test/**/*.js"],
                        dest: 'build_jsx/',
                        ext: '.js'
                    }
                ]
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/js/all.min.js': [
                        'build_jsx/js/utils.js',
                        'build_jsx/**/*.js',
                        '!build_jsx/**/__tests__/*',
                        '!build_jsx/js/start.js'
                        ],

                    'dist/js/libs.min.js': [
                        'libs/jquery.min.js',
                        'libs/react-with-addons.js',
                        ]

                }
            }
        },

        copy: {
            dist: {
                src: 'index_template.html',
                dest: 'dist/index.html'
            },
            
            css: {
                src: 'css/*',
                dest: 'dist/'
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask('build', ['react', 'uglify', 'copy:dist', 'copy:css']);
    grunt.registerTask('test', ['karma']);

};