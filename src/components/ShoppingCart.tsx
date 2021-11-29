import React from 'react'
import styles from './ShoppingCart.module.css'

interface Props {}

interface State {
  isOpen: boolean
}

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
    console.log(e.target)
    console.log(e.currentTarget)
    if ((e.target as HTMLElement).nodeName === 'SPAN') {
      this.setState({ isOpen: !this.state.isOpen })
    }
  }

  render() {
    return (
      <div className={styles.cartContainer}>
        <button className={styles.button} onClick={this.handleClick}>
          <i>我是一个i标签</i>
          <span>购物车</span>
        </button>
        <div
          className={styles.cartDropDown}
          style={{
            display: this.state.isOpen ? 'block' : 'none',
          }}
        >
          <ul>
            <li>robot 1</li>
            <li>robot 2</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default ShoppingCart
