module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        version: 6,
        lib_version: 4,
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
                    'dist/js/all.<%= version %>.min.js': [
                        'build_jsx/js/utils.js',
                        'build_jsx/**/*.js',
                        '!build_jsx/**/__tests__/*',
                        '!build_jsx/js/start.js'
                        ],

                    'dist/js/libs.<%= lib_version %>.min.js': [
                        'libs/react-with-addons.js',
                        ]

                }
            }
        },

        copy: {
            css: {
                src: 'css/*',
                dest: 'dist/'
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        clean: {
            dist: ["dist/**/*.*"]
        },
        replace: {
            example: {
                src: ['index_template.html'],
                dest: 'dist/index.html',
                replacements: [
                    {
                        from: '@build_no',
                        to: '<%= version %>'
                    },
                    {
                        from: '@lib_no',
                        to: '<%= lib_version %>'
                    },
                ]
            }
        }
    });

    grunt.registerTask('build', ['clean:dist', 'react', 'uglify', 'replace', 'copy:css']);

    grunt.registerTask('test', ['karma']);

};