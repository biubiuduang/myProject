/**
 * Created by Jacky.Wang on 2016/7/27.
 */
//包含函数
module.exports = function(grunt){
    //任务配置,所有插件的配置信息
    grunt.initConfig({
       pkg : grunt.file.readJSON("package.json"),

        //清除目录
        clean :　["dest"],

        //拷贝
        copy : {
            temp : {
                files:[
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
                        src : ["libs/*.js","libs/*.min.js","sdk/*.js","sdk/*.min.js"],
                        dest : "dest/themes/js/"
                    },
                    {
                        expand : true,
                        cwd : "themes/css/",
                        src : ["libs/*.min.css","giftsList.css"],
                        dest : "dest/themes/css/"
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
                }
            },
            task1 : {
                files : {
                    "dest/themes/js/index.js":["themes/js/index.js"],
                    "dest/themes/js/liveRoom.js":["themes/js/liveRoom.js"],
                    "dest/themes/js/sdk/im.js" :["themes/js/sdk/im.js"]
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
                    "dest/index.html":["dest/index.html"],
                    "dest/liveRoom.html":["dest/liveRoom.html"],
                    "dest/giftsList.html":["dest/giftsList.html"]
                }
            }
        },

        //文件版本控制(md5)
        filerev : {
            options : {
                algorithm : "md5",
                length : 8
            },
            //img : {
            //    src : ["dest/themes/img/*.{jpg,jpeg,png,gif,webp,icon,ico}"]
            //},
            css : {
                src : ["dest/themes/css/*"]
            },
            js : {
                src : ["dest/themes/js/**/*","!dest/themes/js/libs/*","!dest/themes/js/sdk/*"]
            }
        },

        //各个文件处理
        usemin : {
            css : [["dest/themes/css/*.css"],["dest/themes/css/*.min.css"]],
            js : [["dest/themes/js/*.js"],["dest/themes/js/libs/*.js"],["dest/themes/js/sdk/*.js"]],
            html : ["dest/*.html"],
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
    grunt.registerTask('default',['clean','copy','uglify:task1','cssmin','processhtml','filerev','usemin']);
};
