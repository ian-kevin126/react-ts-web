{
  "compilerOptions": {
    "noImplicitAny": false, // 是否显式声明变量为any类型，配置为false可以实现js和ts的混编
    /**
    这个属性定义了编译后的目标JavaScript版本，一般来说，我们需要编译成es5，这样就可以被主流浏览器解读了。如果，我们编译的
    代码不是给浏览器看的，比如说，我们使用的是react-native做手机app，那么这里的选项还可以是es6，除了这两个之外，我们还可
    以选择es2015，es2016，es2017，es2018，es2019，esnext等
    */
    "target": "es5",
    /**
    这个属性列出了编译期间需要被包括进来的库文件，通过这些库文件，告诉TypeScript编译器可以使用哪些功能。比如说
    我们这里有一个dom的库文件，这个文件会告诉编译器dom api的接口，所以当我们在ts代码中使用dom的时候，比如说执行
    document.getElementById('root')，这句话的时候，编译器就会知道该如何检查。如果我们不设置这个选项，那么编译器
    也有自己默认的库文件列表，一般来说是['dom', 'es6', 'DOM.Iterable']。
    **/
    "lib": ["dom", "dom.iterable", "esnext"],
    // 开启，表示允许我们混合编写js和ts
    "allowJs": true,
    "skipLibCheck": true,
    /**
    这个选项允许我们使用commonjs的方式import默认文件，不开启的时候，我们就需要写：
    import * as React from 'react'

    开启之后，import方式就和普通的JavaScript没有区别，我们就可以写成：
    import React from 'react'

    这样处理项目引入更自然
    **/
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    /**
    这个配置的是我们的模块系统，比较常见的有/Nodejs的Commonjs、ES6标准的esnext、requirejs的AMD
    这里我们使用的是ES6标准的esnext，不过把这里的标准换成CommonJS也是可以的。
    **/
    "module": "esnext",
    /**
    这个选项决定了我们编译器的工作方式，也决定了我们各个文件之间调用、import的工作流程。这里
    曾经有两个选项——node和classic，但是classic在2019年12月就已经废弃了。
    **/
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true, // 编译器会将每个文件作为单独的模块来使用
    "noEmit": true, // 表示当发生错误的时候，编译器不要生成JavaScript代码
    "jsx": "react-jsx", // 允许编译器支持编译JSX代码
    /**
    使用 typescript-plugin-css-modules 插件
    // yarn add typescript-plugin-css-modules -D
    然后在项目根目录下新建.vscode文件夹，新建settings.json，配置下面的代码：
    {
      "typescript.tsdk": "node_modules/typescript/lib",
      "typescript.enablePromptUseWorkspaceTsdk": true
    }
    这样，我们在写css样式的时候，也可以得到智能提示了。
    **/
    "plugins": [{ "name": "typescript-plugin-css-modules" }]
  },
  /**
  使用此选项列出我们需要编译的文件，“文件路径”选项需要文件的相对或者绝对路径，例如：
  "**"：任意子目录
  "*"：任意文件名
  "?"：只要字符跟随"?"，这个字符就会被视为可忽略字符（例如，"src/*.tsx?"则同时指代"src/.tsx"与"src/*.ts"）
  **/
  "include": ["src"]
  /**
  使用此选项列出编译器应始终包含在编译中的文件。无论是否使用“exclude”选项，都将会编译使用此选项内包括的所有文件。
  **/
  // "files": [],
  /**
  此选项将会列出从编译中排除的文件，它与“include”选项采用相同的模式，我们以使用此选项来过滤使用“include”选项指定的文件。
  但是，“exclude”选项不会影响“files”选项。
  通常，我们会排除node_modules、测试文件和编译输出目录文件。
  如果省略此选项，编译器会使用“outDir”选项指定的文件夹。
  如果没有同时指定“files”和“include”这两个选项，则编译器将编译根目录和任何子目录中的所有TS文件，但不包括使用“exclude”选项指定的文件。
  **/
  // "exclude": []
}
