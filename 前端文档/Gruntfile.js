/**
 * Created by Jacky.Wang on 2016/7/27.
 */
//包含函数
module.exports = function(grunt){
    //任务配置,所有插件的配置信息
    grunt.initConfig({
       pkg : grunt.file.readJSON("package.json"),

        //合并文件  (css压缩带合并压缩)
        //concat :{
        //    css : {
        //        src : [
        //            'themes/css/common/base.css',
        //            'themes/css/doc/doc.css'
        //        ],
        //        dest : 'dest/themes/css/base.css'
        //    }
        //},

        //清除目录
        clean :　["dest"],

        //拷贝
        copy : {
            temp : {
                files:[
                    {
                        expand : true,
                        cwd : "themes/css/",
                        src : "lteie8.css",
                        dest: "dest/themes/css/"
                    },
                    {
                        expand : true,
                        src : "*.html",
                        dest: "dest"
                    },
                    {
                        expand : true,
                        cwd : "themes/",
                        src : "img/**",
                        dest : "dest/themes/"
                    },
                    {
                        expand : true,
                        cwd : "themes/js/",
                        src : ["libs/*.js","libs/*.min.js"],
                        dest : "dest/themes/js/"
                    },
                    {
                        expand : true,
                        cwd : "themes/",
                        src : ["font/**/*.{eot,svg,ttf,woff}","font/*.{eot,svg,ttf,woff}"],
                        dest : "dest/themes/"
                    }
                ]
            },
            dest : {
                files:[

                ]
            }
        },

        //压缩JS
        uglify : {
            target:{
                files : {
                    "dest/themes/js/libs/css3-mediaqueries.js":["themes/js/libs/css3-mediaqueries.js"]
                }
            },
            task1 : {
                files : {
                    "dest/themes/js/base.js":["themes/js/base.js"]
                }
            }
        },

        //CSS合并压缩
        cssmin : {
            target : {
                files : {
                    "dest/themes/css/main.css":["themes/css/base.css"]
                }
            }
        },

        //HTML文件处理
        processhtml : {
            options : {},
            dist:{
                files : {
                    "dest/doc.html":["dest/doc.html"]
                }
            }
        },

        //文件版本控制(md5)
        filerev : {
            options : {
                algorithm : "md5",
                length : 8
            },
            img : {
                src : ["dest/themes/img/**/*.{jpg,jpeg,png,gif,webp,icon,ico}"]
            },
            css : {
                src : ["dest/themes/css/**/*"]
            },
            js : {
                src : ["dest/themes/js/**/*","!dest/themes/js/libs/*"]
            }
        },

        //各个文件处理
        usemin : {
            css : ["dest/themes/css/*"],
            js : ["dest/themes/js/**/*"],
            html : ["dest/doc.html"],
            options : {
                assetsDirs : ["dest","dest/themes","dest/themes/css","dest/themes/js","dest/themes/img"],
                //处理js内的图片
                patterns: {
                    js: [
                        [/(\/img\/[\/\w-]+\.png)/, 'replace image in js'],
                        [/(\/img\/[\/\w-]+\.jpg)/, 'replace image in js']
                    ]
                }
            }
        }
    });

    //告诉grunt我们将要使用的插件
    grunt.loadNpmTasks('grunt-contrib-copy');    //拷贝文件
    grunt.loadNpmTasks('grunt-contrib-concat');  //合并文件
    grunt.loadNpmTasks('grunt-contrib-cssmin');   //css压缩
    grunt.loadNpmTasks('grunt-contrib-uglify');   //js压缩
    grunt.loadNpmTasks("grunt-processhtml"); //HTML文件处理
    grunt.loadNpmTasks('grunt-usemin');   //各个文件处理
    grunt.loadNpmTasks('grunt-contrib-clean');  //清除
    grunt.loadNpmTasks('grunt-filerev');  //文件版本控制(md5)

    //告诉grunt当我们在终端中输入grunt时需要做些什么(注意先后顺序)
    grunt.registerTask('default',['clean','copy','uglify:target','uglify:task1','cssmin','processhtml','filerev','usemin']);
};
