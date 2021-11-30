import React, { useEffect } from "react";
import styles from "./App.module.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  HomePage,
  SignInPage,
  RegisterPage,
  DetailPage,
  SearchPage,
  ShoppingCartPage,
  PlaceOrderPage,
} from "./pages";
import { Redirect } from "react-router-dom";
import { useSelector } from "./redux/hooks";
import { useDispatch } from "react-redux";
import { getShoppingCart } from "./redux/shoppingCart/slice";

const PrivateRoute = ({ component, isAuthenticated, ...rest }) => {
  const routeComponent = (props) => {
    return isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/signIn" }} />
    );
  };
  return <Route render={routeComponent} {...rest} />;
};

function App() {
  const jwt = useSelector((s) => s.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jwt) {
      dispatch(getShoppingCart(jwt));
    }
  }, [jwt]);

  /**
   * exact：路由是否精确匹配，如果首页不配置exact属性，'/'也会匹配后面的任何路由，导致首页跟其他的页面同时显示
   * Switch：这个组件则每次只渲染一条单独的路径，彻底解决页面堆叠的问题
   * 所以，一般首页路由都要加上exact属性，并把所有路由用Switch包裹，不然就会出现一些问题（'/'短路后续的路由，以及路由堆叠的问题）
   * swi解决路由堆叠的问题，exact解决路由精确匹配的问题。
   *
   * 404 页面要放在最后
   *
   * 一般网站路由系统的基本要求：
   * -1，路由导航与原生浏览器操作行为一致——使用 <BrowserRouter></BrowserRouter>
   * -2，路由的路径解析原理与原生浏览器一致，可以自动识别url路径——使用 <Route />
   * -3，路径的切换以页面为单位，不要页面堆叠——使用 <Switch />
   */
  return (
    <div className={styles.App}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/signIn" component={SignInPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/detail/:touristRouteId" component={DetailPage} />
          <Route path="/search/:keywords?" component={SearchPage} />
          <PrivateRoute
            isAuthenticated={jwt !== null}
            path="/shoppingCart"
            component={ShoppingCartPage}
          />
          <PrivateRoute
            isAuthenticated={jwt !== null}
            path="/placeOrder"
            component={PlaceOrderPage}
          />
          <Route render={() => <h1>404 not found 页面去火星了 ！</h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
