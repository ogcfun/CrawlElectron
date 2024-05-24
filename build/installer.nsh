; 定义产品的版本号
!define PRODUCT_VERSION "1.0.0"

; 定义变量，用于存储头部区域的子标题文本
Var ogcfunCrawl.Header.SubText

; 定义变量，用于存储组件区域的主要文本
Var ogcfunCrawl.Component.MainText

; 定义变量，用于存储安装类型
Var ogcfunCrawl.Component.InstallationType

; 定义变量，用于存储安装类型的描述文本
Var ogcfunCrawl.Component.InstallationTypeText

; 定义变量，用于存储组件列表标题文本
Var ogcfunCrawl.Component.ComponentListTitleText

; 定义变量，用于存储组件列表
Var ogcfunCrawl.Component.ComponentList

; 定义变量，用于存储组件描述标题文本
Var ogcfunCrawl.Component.DescriptionTitleText

; 定义变量，用于存储组件描述文本
Var ogcfunCrawl.Component.DescriptionText

; 定义变量，用于存储磁盘空间大小文本
Var ogcfunCrawl.Component.DiskSizeText

InstallDir "D:\ogcfunCrawl" ; 设置默认安装目录

# use MUI
!include "MUI.nsh"

# 基本用户界面信息
; 设置安装程序的窗口标题为 "ogcfun Crawl Installer"
Caption "ogcfun Crawl Installer"

; 设置安装程序窗口底部的品牌文本，内容为 "ogcfun Crawl 1.0"
BrandingText /TRIMLEFT "ogcfun Crawl ${PRODUCT_VERSION}"

; MUI Settings
; 定义 MUI_ABORTWARNING，启用用户取消安装时的警告提示
!define MUI_ABORTWARNING

; 定义 MUI_HEADERIMAGE，用于启用安装程序顶部区域的自定义图像
!define MUI_HEADERIMAGE

; 定义 MUI_HEADERIMAGE_BITMAP，指定顶部区域自定义图像的路径为 "..\resource\header_150x57.bmp"
!define MUI_HEADERIMAGE_BITMAP "..\resource\header_150x57.bmp"

; 定义 MUI_HEADERIMAGE_BITMAP_STRETCH，设置顶部区域自定义图像的拉伸方式为 NoStretchNoCropNoAlign 即不拉伸、不裁剪、不对齐
!define MUI_HEADERIMAGE_BITMAP_STRETCH NoStretchNoCropNoAlign

; 定义 MUI_HEADERIMAGE_RIGHT，设置顶部区域自定义图像显示在右侧
!define MUI_HEADERIMAGE_RIGHT

; 欢迎界面
; 定义 MUI_WELCOMEFINISHPAGE_BITMAP，指定欢迎和完成页面的背景图像路径为 ".\resource\welcome_install.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "..\resource\welcome_install.bmp"

; 插入 MUI_PAGE_WELCOME 宏，用于添加一个欢迎页面到安装程序
!insertmacro MUI_PAGE_WELCOME

; 安装目录选择页面
!insertmacro MUI_PAGE_DIRECTORY ; 插入安装目录选择页面宏

; 安装文件页面
ShowInstDetails hide ; 隐藏安装详情
!insertmacro MUI_PAGE_INSTFILES ; 插入安装文件页面宏

; 完成页面
!define MUI_FINISHPAGE_RUN ; 定义完成页面包含运行程序的选项
!define MUI_FINISHPAGE_RUN_TEXT "ogcfun Crawl" ; 定义运行程序的文本
!define MUI_FINISHPAGE_RUN_FUNCTION FinishRun ; 定义自定义函数，在完成页面中运行程序
!insertmacro MUI_PAGE_FINISH ; 插入完成页面宏

; 卸载程序页面
!insertmacro MUI_UNPAGE_COMPONENTS ; 插入卸载组件页面宏
ShowUnInstDetails nevershow ; 禁用卸载详情以提高速度
!insertmacro MUI_UNPAGE_INSTFILES ; 插入卸载文件页面宏
