# Getting Started with Create React App

## tsconfig.json 配置
```json
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
    有时候不生效，可参考：https://blog.csdn.net/bidang3275/article/details/119571270
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

```

## css 模组化
在src文件夹下面新建一个 custom.d.ts 声明文件：
```js
/**
 * 声明css文件为模组化的文件，这样就可以以下面的方式导入
 * import styles from './index.css
 */

declare module "*.css" {
  const css: { [key: string]: string };
  export default css;
}
```
然后将所有的css文件改成 .module.css后缀。
还可以使用 typescript-plugin-css-modules 插件实现className的智能提示。

## 加载媒体与字体文件
图片类型的文件已经被react提前声明好了，我们不需要再做处理，只需要直接引用就好了。
### 字体的使用
在顶级组件中的index.css中定义字体，然后子组件中就都可以使用了：
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: cadetblue;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

@font-face {
  font-family: 'Slidefu';
  src: local('Slidefu'), url(./assets/fonts/Slidefu-Regular-2.ttf) format('truetype');
}
```
然后再App.module.css中使用
```css
h1 {
  font-family: 'Slidefu';
  font-size: 72px;
}
```


```js
/**
 * props和state的区别
 * - props是组件对外的接口，state是组件对内的接口
 * - props用于组件间数据传递，state用于组件内部的数据传递
 * - state是私有的，可以认为state是组件的“私有属性”，需要用setState()修改state
 * - 本质上，props就是传入函数的参数，是传入组件内部的数据，更确切地说，是从父组件传递向子组件的数据
 *
 * immutable（不变的）：对象一旦创建就不可改变，只能通过销毁、重建来改变数据，通过判断内存地址是否一致，来确认对象是否有经过修改。
 * - props是只读属性
 * - 函数式编程
 *
 */
```

### React 生命周期
```jsx
import React from 'react'
import logo from './assets/images/logo.svg'
import robots from './mockdata/robots.json'
import Robot from './components/Robot'
import styles from './App.module.css'
import ShoppingCart from './components/ShoppingCart'
import { count } from 'console'

interface Props {}

interface State {
  robotGallery: any[]
  count: number
}

class App extends React.Component<Props, State> {
  // * 生命周期第一阶段： 初始化
  // 初始化组件 state
  constructor(props: Props) {
    super(props)
    this.state = {
      robotGallery: [],
      count: 0,
    }
  }

  // 在组件创建好dom元素以后、挂载进页面的时候调用
  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => this.setState({ robotGallery: data }))
  }

  // * 生命周期第二阶段： 更新
  // 在组件接收到一个新的 prop (更新后)时被调用。
  // componentWillReceiveProps

  // componentWillReceiveProps已经被废弃，替代品：
  // state getDerivedStateFromProps(nextProps, prevState){}

  // shouldComponentUpdate(nextProps, nextState){
  //   return nextState.some !== this.state.some
  // }

  // 组件更新后调用
  componentDidUpdate() {}

  // * 生命周期第三阶段： 销毁
  // 组件销毁后调用，
  // 可以当作析构函数 destructor 来使用
  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.appHeader}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <h1>罗伯特机器人炫酷吊炸天online购物平台的名字要长</h1>
        </div>
        <button
          onClick={() => {
            /**
             * setState到底是同步还是异步的？——异步更新，同步执行，setState本身并不是异步的，但对state的处理机制给人一一种
             * 异步的假象，state处理一般发生在生命周期变化的时候。
             */
            // this.setState(
            //   {
            //     count: this.state.count + 1,
            //   },
            //   () => console.log(this.state.count)
            // )
            // this.setState(
            //   {
            //     count: this.state.count + 1,
            //   },
            //   () => console.log(this.state.count)
            // )

            // 解决方法：
            this.setState(
              (preState, preProps) => {
                return { count: preState.count + 1 }
              },
              () => {
                console.log('count ', this.state.count)
              }
            )
            this.setState(
              (preState, preProps) => {
                return { count: preState.count + 1 }
              },
              () => {
                console.log('count ', this.state.count)
              }
            )
          }}
        >
          Click
        </button>
        <span>count: {this.state.count}</span>
        <ShoppingCart />
        <div className={styles.robotList}>
          {this.state.robotGallery.map((r) => (
            <Robot id={r.id} email={r.email} name={r.name} />
          ))}
        </div>
      </div>
    )
  }
}

export default App

```

## React Hooks
### useEffect 的使用
```jsx
import React, { useState, useEffect } from 'react'
import logo from './assets/images/logo.svg'
import robots from './mockdata/robots.json'
import Robot from './components/Robot'
import RobotDiscount from './components/RobotDiscount'
import styles from './App.module.css'
import ShoppingCart from './components/ShoppingCart'

interface Props {}

interface State {
  robotGallery: any[]
  count: number
}

const App: React.FC = (props) => {
  const [count, setCount] = useState<number>(0)
  const [robotGallery, setRobotGallery] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    document.title = `点击${count}次`
  }, [count])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const responses = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      )
      // .then(response => response.json())
      // .then(data => setRobotGallery(data))
      const data = await responses.json()
      setRobotGallery(data)
    } catch (e) {
      // setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div className={styles.app}>
      <div className={styles.appHeader}>
        <img src={logo} className={styles.appLogo} alt="logo" />
        <h1>罗伯特机器人炫酷吊炸天online购物平台的名字要长</h1>
      </div>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Click
      </button>
      <span>count: {count}</span>
      <ShoppingCart />
      {(!error || error !== '') && <div>网站出错：{error}</div>}
      {!loading ? (
        <div className={styles.robotList}>
          {robotGallery.map((r, index) =>
            index % 2 == 0 ? (
              <RobotDiscount
                key={r.id}
                id={r.id}
                email={r.email}
                name={r.name}
              />
            ) : (
              <Robot key={r.id} id={r.id} email={r.email} name={r.name} />
            )
          )}
        </div>
      ) : (
        <h2>loading 加载中</h2>
      )}
    </div>
  )
}

export default App
```

### useContext 的使用
AppState.ts
```tsx
import React, { useState } from 'react'

interface AppStateValue {
  username: string
  shoppingCart: { items: { id: number; name: string }[] }
}

const defaultContextValue: AppStateValue = {
  username: 'kevinliao',
  shoppingCart: { items: [] },
}

export const appContext = React.createContext(defaultContextValue)
export const appSetStateContext = React.createContext<
  React.Dispatch<React.SetStateAction<AppStateValue>> | undefined
>(undefined)

export const AppStateProvider: React.FC = (props) => {
  const [state, setState] = useState(defaultContextValue)

  return (
    <appContext.Provider value={state}>
      <appSetStateContext.Provider value={setState}>
        {props.children}
      </appSetStateContext.Provider>
    </appContext.Provider>
  )
}
```

```ts
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { AppStateProvider } from './AppState'

ReactDOM.render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
```

```tsx
import React, { useContext } from 'react'
import styles from './Robot.module.css'
import { appContext, appSetStateContext } from '../AppState'
import { withAddToCart } from './AddToCart'

export interface RobotProps {
  id: number
  name: string
  email: string
  addToCart: (id, name) => void
}

const Robot: React.FC<RobotProps> = ({ id, name, email, addToCart }) => {
  const value = useContext(appContext)

  return (
    <div className={styles.cardContainer}>
      <img alt="robot" src={`https://robohash.org/${id}`} />
      <h2>{name}</h2>
      <p>{email}</p>
      <p>作者：{value.username}</p>
      <button onClick={() => addToCart(id, name)}>加入购物车</button>
    </div>
  )
}

export default withAddToCart(Robot)

```

```tsx
import React from 'react'
import styles from './ShoppingCart.module.css'
import { FiShoppingCart } from 'react-icons/fi'
import { appContext } from '../AppState'

interface Props {}

interface State {
  isOpen: boolean
}

class ShoppingCart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // e.target：描述的是时间发生的元素
    // e.currentTarget：描述的是事件处理绑定的元素
    console.log('e.target ', e.target)
    console.log('e.currentTarget ', e.currentTarget)
    if ((e.target as HTMLElement).nodeName === 'SPAN') {
      this.setState({ isOpen: !this.state.isOpen })
    }
  }

  render() {
    return (
      <appContext.Consumer>
        {(value) => {
          return (
            <div className={styles.cartContainer}>
              <button className={styles.button} onClick={this.handleClick}>
                <FiShoppingCart />
                <span>购物车 {value.shoppingCart.items.length} (件)</span>
              </button>
              <div
                className={styles.cartDropDown}
                style={{
                  display: this.state.isOpen ? 'block' : 'none',
                }}
              >
                <ul>
                  {value.shoppingCart.items.map((i) => (
                    <li>{i.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }}
      </appContext.Consumer>
    )
  }
}

export default ShoppingCart
```

```tsx
import React, { useContext } from 'react'
import { appSetStateContext } from '../AppState'
import { RobotProps } from './Robot'

export const withAddToCart = (
  ChildComponent: React.ComponentType<RobotProps>
) => {
  // return class extends React.Component {}
  return (props) => {
    const setState = useContext(appSetStateContext)
    const addToCart = (id, name) => {
      if (setState) {
        // 思考: 同学们可以想一想如何化简这里的代码
        setState((state) => {
          return {
            ...state,
            shoppingCart: {
              items: [...state.shoppingCart.items, { id, name }],
            },
          }
        })
      }
    }
    return <ChildComponent {...props} addToCart={addToCart} />
  }
}

export const useAddToCart = () => {
  const setState = useContext(appSetStateContext)
  const addToCart = (id, name) => {
    if (setState) {
      // 思考: 同学们可以想一想如何化简这里的代码
      setState((state) => {
        return {
          ...state,
          shoppingCart: {
            items: [...state.shoppingCart.items, { id, name }],
          },
        }
      })
    }
  }
  return addToCart
}
```