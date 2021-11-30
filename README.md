# React + TypeScript + Web

## react-router 

- 会自动安装 react-router 核心框架，所以，我们不需要再安装 react-router 了
- BrowserRouter 组件利用 HTML5 API 实现路由切换
- HashRouter 组件利用原生 JS 中的 window.location.hash 来实现路由切换

### 使用HOC或者Hooks传递路由数据

```jsx
import React from "react";
import { Image, Typography } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {
    id: string | number;
    size: "large" | "small";
    imageSrc: string;
    price: number | string;
    title: string;
}

/**
 * 由于productionImage上绑定了点击跳转到详情页的事件，所以，我们一般将这种组件用react-router的高阶组件方法来包裹。
 * 这个时候 PropsType 就需要继承自 RouteComponentProps，跳转用 history 方式，当然，我们还可以直接用 Link
 *
 * 除了HOC方式实现传递路由数据，还可以用hooks来实现，在Header.tsx组件中可以看到
 */
const ProductImageComponent: React.FC<PropsType> = ({
    id,
    size,
    imageSrc,
    price,
    title,
    history,
    location,
    match,
}) => {
    // console.log(history)
    // console.log(location)
    // console.log(match)
    return (
        <div onClick={()=> history.push(`detail/${id}`)}>
            {size === "large" ? (
                <Image src={imageSrc} height={285} width={490} />
            ) : (
                <Image src={imageSrc} height={120} width={240} />
            )}
            <div>
                <Typography.Text type="secondary">{title.slice(0, 25)}</Typography.Text>
                <Typography.Text type="danger" strong>
                    ¥ {price} 起
                </Typography.Text>
            </div>
        </div>
    );
};

export const ProductImage = withRouter(ProductImageComponent);

```

#### 推荐

在函数组件中使用Hooks来传递路由数据

```jsx
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
  LanguageActionTypes,
  addLanguageActionCreator,
  changeLanguageActionCreator,
} from "../../redux/language/languageActions";
import { useTranslation } from "react-i18next";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { userSlice } from "../../redux/user/slice";

interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const match = useRouteMatch();
  const language = useSelector((state) => state.language.language);
  const languageList = useSelector((state) => state.language.languageList);
  const dispatch = useDispatch();
  // const dispatch = useDispatch<Dispatch<LanguageActionTypes>>();
  const { t } = useTranslation();

  const jwt = useSelector((s) => s.user.token);
  const [username, setUsername] = useState("");

  const shoppingCartItems = useSelector((s) => s.shoppingCart.items);
  const shoppingCartLoading = useSelector((s) => s.shoppingCart.loading);

  useEffect(() => {
    if (jwt) {
      const token = jwt_decode<JwtPayload>(jwt);
      setUsername(token.username);
    }
  }, [jwt]);

  const menuClickHandler = (e) => {
    console.log(e);
    if (e.key === "new") {
      // 处理新语言添加action
      dispatch(addLanguageActionCreator("新语言", "new_lang"));
    } else {
      dispatch(changeLanguageActionCreator(e.key));
    }
  };

  const onLogout = () => {
    dispatch(userSlice.actions.logOut());
    history.push("/");
  };

  return (
    <div className={styles["app-header"]}>
      {/* top-header */}
      <div className={styles["top-header"]}>
        <div className={styles.inner}>
          <Typography.Text>{t("header.slogan")}</Typography.Text>
          <Dropdown.Button
            style={{ marginLeft: 15 }}
            overlay={
              <Menu onClick={menuClickHandler}>
                {languageList.map((l) => {
                  return <Menu.Item key={l.code}>{l.name}</Menu.Item>;
                })}
                <Menu.Item key={"new"}>
                  {t("header.add_new_language")}
                </Menu.Item>
              </Menu>
            }
            icon={<GlobalOutlined />}
          >
            {language === "zh" ? "中文" : "English"}
          </Dropdown.Button>
          {jwt ? (
            <Button.Group className={styles["button-group"]}>
              <span>
                {t("header.welcome")}
                <Typography.Text strong>{username}</Typography.Text>
              </span>
              <Button
                loading={shoppingCartLoading}
                onClick={() => history.push("/shoppingCart")}
              >
                {t("header.shoppingCart")}({shoppingCartItems.length})
              </Button>
              <Button onClick={onLogout}>{t("header.signOut")}</Button>
            </Button.Group>
          ) : (
            <Button.Group className={styles["button-group"]}>
              <Button onClick={() => history.push("/register")}>
                {t("header.register")}
              </Button>
              <Button onClick={() => history.push("/signIn")}>
                {t("header.signin")}
              </Button>
            </Button.Group>
          )}
        </div>
      </div>
      <Layout.Header className={styles["main-header"]}>
        <span onClick={() => history.push("/")}>
          <img src={logo} alt="logo" className={styles["App-logo"]} />
          <Typography.Title level={3} className={styles.title}>
            {t("header.title")}
          </Typography.Title>
        </span>
        <Input.Search
          placeholder={"请输入旅游目的地、主题、或关键字"}
          className={styles["search-input"]}
          onSearch={(keywords) => history.push("/search/" + keywords)}
        />
      </Layout.Header>
    </div>
  );
};

```

### Link

Link 组件可以代替history实现路由跳转：

```jsx
import React from "react";
import { Image, Typography } from "antd";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

interface PropsType extends RouteComponentProps {
  id: string | number;
  size: "large" | "small";
  imageSrc: string;
  price: number | string;
  title: string;
}

/**
 * 由于productionImage上绑定了点击跳转到详情页的事件，所以，我们一般将这种组件用react-router的高阶组件方法来包裹。
 * 这个时候 PropsType 就需要继承自 RouteComponentProps，跳转用 history 方式，当然，我们还可以直接用 Link
 *
 * 除了HOC方式实现传递路由数据，还可以用hooks来实现，在Header.tsx组件中可以看到
 */
const ProductImageComponent: React.FC<PropsType> = ({
  id,
  size,
  imageSrc,
  price,
  title,
  history,
  location,
  match,
}) => {
  // console.log(history)
  // console.log(location)
  // console.log(match)
  return (
    // <div onClick={()=> history.push(`detail/${id}`)}>
    <Link to={`detail/${id}`}>
      {size === "large" ? (
        <Image src={imageSrc} height={285} width={490} />
      ) : (
        <Image src={imageSrc} height={120} width={240} />
      )}
      <div>
        <Typography.Text type="secondary">{title.slice(0, 25)}</Typography.Text>
        <Typography.Text type="danger" strong>
          ¥ {price} 起
        </Typography.Text>
      </div>
    </Link>
    // </div>
  );
};

export const ProductImage = withRouter(ProductImageComponent);

```

## redux 基础

[redux中文文档](https://www.redux.org.cn/)

[Redux 中的 reducer 到底是什么，以及它为什么叫 reducer？](https://chinese.freecodecamp.org/news/what-exactly-is-reducer-in-redux/)

[redux的设计思想和使用场景](https://segmentfault.com/a/1190000015367584)

![image-20211130175514253](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175514253.png)

![image-20211130175456206](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175456206.png)

![image-20211130174525572](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130174525572.png)

redux 统一保存数据，在隔离了数据与UI的同时，负责处理数据的绑定。使得状态的变化可控可预测。

![image-20211130175559534](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175559534.png)

### 什么时候需要使用redux

- 组件需要共享数据（或者叫state）的时候
- 某个状态需要在任何地方都可以被随时访问的时候
- 某个组件需要改变另一个组件的状态的时候
- 语言切换、黑暗模式切换、用户登录全局数据共享
- ...

![image-20211130175618678](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175618678.png)

![image-20211130175638682](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175638682.png)

![image-20211130175659062](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175659062.png)

![image-20211130175714360](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130175714360.png)

### 国际化

![image-20211130192255208](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130192255208.png)

![image-20211130192346637](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130192346637.png)

```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translation_en from "./en.json";
import translation_zh from "./zh.json";

const resources = {
  en: {
    translation: translation_en,
  },
  zh: {
    translation: translation_zh,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "zh",
    // keySeparator: false, // we do not use keys in form messages.welcome
    // header.slogan
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

```

#### en.json

```json
{
    "header": {
        "slogan": "Make travel happier",
        "add_new_language": "add new language",
        "title": "React Travel",
        "register":"Register",
        "signin":"Sign In",
        "home_page": "Home",
        "weekend": "Weekend",
        "group": "Group",
        "backpack": "Backpack",
        "private": "Private",
        "cruise": "Cruise",
        "hotel": "Hotel & Attractions",
        "local": "Local",
        "theme": "Theme",
        "custom": "Custom",
        "study": "Study",
        "visa":"Visa",
        "enterprise":"Enterprise",
        "high_end":"High-end",
        "outdoor":"Outdoor",
        "insurance":"Insurance",
        "shoppingCart": "Shopping Cart",
        "signOut": "Sign Out",
        "welcome": "Welcome back "
    },
    "footer": {
        "detail" : "All rights reserved @ ReactTravel.com"
    },
    "home_page": {
        "hot_recommended": "Hot Recommended",
        "new_arrival": "New arrival",
        "domestic_travel": "Domestic travel",
        "joint_venture": "Joint Venture",
        "start_from": "(start from)"
    }
}
```

#### zh.json

```json
{
    "header": {
        "slogan": "让旅行更幸福",
        "add_new_language": "添加新语言",
        "title": "React 旅游网",
        "register":"注册",
        "signin":"登陆",
        "home_page": "旅游首页",
        "weekend": "周末游",
        "group": "跟团游",
        "backpack": "自由行",
        "private": "私家团",
        "cruise": "邮轮",
        "hotel": "酒店+景点",
        "local": "当地玩乐",
        "theme": "主题游",
        "custom": "定制游",
        "study": "游学",
        "visa":"签证",
        "enterprise":"企业游",
        "high_end":"高端游",
        "outdoor":"爱玩户外",
        "insurance":"保险",
        "shoppingCart": "购物车",
        "signOut": "注销",
        "welcome": "欢迎回来 "
    },
    "footer": {
        "detail" : "版权所有 @ React 旅游网"
    },
    "home_page": {
        "hot_recommended": "爆款推荐",
        "new_arrival": "新品上市",
        "domestic_travel": "国内游推荐",
        "joint_venture": "合作企业",
        "start_from": "(起)"
    }
}
```

然后只需要在index.tsx中引入就可以了，就是这么简单：

```tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "antd/dist/antd.css";
import "./i18n/configs";
import { Provider } from "react-redux";
import rootStore from "./redux/store";
import axios from "axios";
import { PersistGate } from "redux-persist/integration/react";

axios.defaults.headers["x-icode"] = "FB80558A73FA658E";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={rootStore.store}>
      <PersistGate persistor={rootStore.persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

```

#### 使用

在类组件中使用

```tsx
import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import store, { RootState } from "../../redux/store";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  addLanguageActionCreator,
  changeLanguageActionCreator,
} from "../../redux/language/languageActions";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import getStoredState from "redux-persist/es/getStoredState";

const mapStateToProps = (state: RootState) => {
  return {
    language: state.language.language,
    languageList: state.language.languageList,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeLanguage: (code: "zh" | "en") => {
      const action = changeLanguageActionCreator(code);
      dispatch(action);
    },
    addLanguage: (name: string, code: string) => {
      const action = addLanguageActionCreator(name, code);
      dispatch(action);
    },
  };
};

type PropsType = RouteComponentProps & // react-router 路由props类型
  WithTranslation & // i18n props类型
  ReturnType<typeof mapStateToProps> & // redux store 映射类型
  ReturnType<typeof mapDispatchToProps>; // redux dispatch 映射类型

class HeaderComponent extends React.Component<PropsType> {
  // 获取store里面的state，这种方式非常复杂，也不利于维护，我们可以将其改造为函数式组件 —— Header.tsx
  // constructor(props) {
  //   super(props);
  //   const storeState = store.getState();
  //   this.state = {
  //     language: storeState.language,
  //     languageList: storeState.languageList,
  //   };

  //   组件监听store变化
  //   store.subScribe(this.handleStoreChange)
  // }

  // handleStoreChange = () => {
  //   const storeState = store.getState();
  //   this.setState({
  //     language: getStoredState.language,
  //   });
  // };

  menuClickHandler = (e) => {
    console.log(e);
    if (e.key === "new") {
      // 处理新语言添加action
      this.props.addLanguage("新语言", "new_lang");
    } else {
      this.props.changeLanguage(e.key);
    }
  };

  render() {
    const { history, t, languageList, language } = this.props;
    return (
      <div className={styles["app-header"]}>
        {/* top-header */}
        <div className={styles["top-header"]}>
          <div className={styles.inner}>
            <Typography.Text>{t("header.slogan")}</Typography.Text>
            {/* 语言切换功能 */}
            <Dropdown.Button
              style={{ marginLeft: 15 }}
              overlay={
                <Menu onClick={this.menuClickHandler}>
                  {languageList.map((l) => {
                    return <Menu.Item key={l.code}>{l.name}</Menu.Item>;
                  })}
                  {/* 添加新语言 */}
                  <Menu.Item key={"new"}>
                    {t("header.add_new_language")}
                  </Menu.Item>
                </Menu>
              }
              icon={<GlobalOutlined />}
            >
              {language === "zh" ? "中文" : "English"}
            </Dropdown.Button>
            <Button.Group className={styles["button-group"]}>
              <Button onClick={() => history.push("register")}>
                {t("header.register")}
              </Button>
              <Button onClick={() => history.push("signIn")}>
                {t("header.signin")}
              </Button>
            </Button.Group>
          </div>
        </div>
        <Layout.Header className={styles["main-header"]}>
          <span onClick={() => history.push("/")}>
            <img src={logo} alt="logo" className={styles["App-logo"]} />
            <Typography.Title level={3} className={styles.title}>
              {t("header.title")}
            </Typography.Title>
          </span>
          <Input.Search
            placeholder={"请输入旅游目的地、主题、或关键字"}
            className={styles["search-input"]}
          />
        </Layout.Header>
        <Menu mode={"horizontal"} className={styles["main-menu"]}>
          <Menu.Item key="1"> {t("header.home_page")} </Menu.Item>
          <Menu.Item key="2"> {t("header.weekend")} </Menu.Item>
          <Menu.Item key="3"> {t("header.group")} </Menu.Item>
          <Menu.Item key="4"> {t("header.backpack")} </Menu.Item>
          <Menu.Item key="5"> {t("header.private")} </Menu.Item>
          <Menu.Item key="6"> {t("header.cruise")} </Menu.Item>
          <Menu.Item key="7"> {t("header.hotel")} </Menu.Item>
          <Menu.Item key="8"> {t("header.local")} </Menu.Item>
          <Menu.Item key="9"> {t("header.theme")} </Menu.Item>
          <Menu.Item key="10"> {t("header.custom")} </Menu.Item>
          <Menu.Item key="11"> {t("header.study")} </Menu.Item>
          <Menu.Item key="12"> {t("header.visa")} </Menu.Item>
          <Menu.Item key="13"> {t("header.enterprise")} </Menu.Item>
          <Menu.Item key="14"> {t("header.high_end")} </Menu.Item>
          <Menu.Item key="15"> {t("header.outdoor")} </Menu.Item>
          <Menu.Item key="16"> {t("header.insurance")} </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(HeaderComponent)));

```

在函数组件中使用：

```tsx
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
  LanguageActionTypes,
  addLanguageActionCreator,
  changeLanguageActionCreator,
} from "../../redux/language/languageActions";
import { useTranslation } from "react-i18next";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { userSlice } from "../../redux/user/slice";

interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const match = useRouteMatch();

  // useSelector 可以帮助我们连接store里面的数据
  // const language = useSelector((state: RootState) => state.language.language);
  /**
   * 这里我们每次使用 useSelector 都要从 store.ts 中去导入RootState类型定义，这将使得我们的组件与store绑定起来了，而
   * 组件与state的绑定会使得这个组件与state深度耦合，无法再被复用，这显然不是我们乐见的。这时候，我们就需要将RootState
   * 从组件中提取出来。基本的方法是使用 TypedUseSelectorHook 这个interface来使我们的store类型重新定义。
   *
   * 在hoohs.ts中重新定义了useSelector这个hooks，这样我们就不需要在每次使用的时候都去再重新定义一遍state的类型。
   */
  const language = useSelector((state) => state.language.language);
  const languageList = useSelector((state) => state.language.languageList);

  // dispatch函数分发事件
  // const dispatch = useDispatch<Dispatch<LanguageActionTypes>>();   虽然这样定义看起来更严谨，但实际上没有必要，破坏了灵活性。
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const jwt = useSelector((s) => s.user.token);
  const [username, setUsername] = useState("");

  const shoppingCartItems = useSelector((s) => s.shoppingCart.items);
  const shoppingCartLoading = useSelector((s) => s.shoppingCart.loading);

  useEffect(() => {
    if (jwt) {
      const token = jwt_decode<JwtPayload>(jwt);
      setUsername(token.username);
    }
  }, [jwt]);

  const menuClickHandler = (e) => {
    console.log(e);
    if (e.key === "new") {
      // 处理新语言添加action
      dispatch(addLanguageActionCreator("新语言", "new_lang"));
    } else {
      dispatch(changeLanguageActionCreator(e.key));
    }
  };

  const onLogout = () => {
    dispatch(userSlice.actions.logOut());
    history.push("/");
  };

  return (
    <div className={styles["app-header"]}>
      {/* top-header */}
      <div className={styles["top-header"]}>
        <div className={styles.inner}>
          <Typography.Text>{t("header.slogan")}</Typography.Text>
          {/* 切换网站语言 */}
          <Dropdown.Button
            style={{ marginLeft: 15 }}
            overlay={
              <Menu onClick={menuClickHandler}>
                {languageList.map((l) => {
                  return <Menu.Item key={l.code}>{l.name}</Menu.Item>;
                })}
                <Menu.Item key={"new"}>
                  {t("header.add_new_language")}
                </Menu.Item>
              </Menu>
            }
            icon={<GlobalOutlined />}
          >
            {language === "zh" ? "中文" : "English"}
          </Dropdown.Button>
          {jwt ? (
            <Button.Group className={styles["button-group"]}>
              <span>
                {t("header.welcome")}
                <Typography.Text strong>{username}</Typography.Text>
              </span>
              <Button
                loading={shoppingCartLoading}
                onClick={() => history.push("/shoppingCart")}
              >
                {t("header.shoppingCart")}({shoppingCartItems.length})
              </Button>
              <Button onClick={onLogout}>{t("header.signOut")}</Button>
            </Button.Group>
          ) : (
            <Button.Group className={styles["button-group"]}>
              <Button onClick={() => history.push("/register")}>
                {t("header.register")}
              </Button>
              <Button onClick={() => history.push("/signIn")}>
                {t("header.signin")}
              </Button>
            </Button.Group>
          )}
        </div>
      </div>
      <Layout.Header className={styles["main-header"]}>
        <span onClick={() => history.push("/")}>
          <img src={logo} alt="logo" className={styles["App-logo"]} />
          <Typography.Title level={3} className={styles.title}>
            {t("header.title")}
          </Typography.Title>
        </span>
        <Input.Search
          placeholder={"请输入旅游目的地、主题、或关键字"}
          className={styles["search-input"]}
          onSearch={(keywords) => history.push("/search/" + keywords)}
        />
      </Layout.Header>
      <Menu mode={"horizontal"} className={styles["main-menu"]}>
        <Menu.Item key="1"> {t("header.home_page")} </Menu.Item>
        <Menu.Item key="2"> {t("header.weekend")} </Menu.Item>
        <Menu.Item key="3"> {t("header.group")} </Menu.Item>
        <Menu.Item key="4"> {t("header.backpack")} </Menu.Item>
        <Menu.Item key="5"> {t("header.private")} </Menu.Item>
        <Menu.Item key="6"> {t("header.cruise")} </Menu.Item>
        <Menu.Item key="7"> {t("header.hotel")} </Menu.Item>
        <Menu.Item key="8"> {t("header.local")} </Menu.Item>
        <Menu.Item key="9"> {t("header.theme")} </Menu.Item>
        <Menu.Item key="10"> {t("header.custom")} </Menu.Item>
        <Menu.Item key="11"> {t("header.study")} </Menu.Item>
        <Menu.Item key="12"> {t("header.visa")} </Menu.Item>
        <Menu.Item key="13"> {t("header.enterprise")} </Menu.Item>
        <Menu.Item key="14"> {t("header.high_end")} </Menu.Item>
        <Menu.Item key="15"> {t("header.outdoor")} </Menu.Item>
        <Menu.Item key="16"> {t("header.insurance")} </Menu.Item>
      </Menu>
    </div>
  );
};

```

### ActionCreator

![image-20211130193834337](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130193834337.png)

![image-20211130195809603](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130195809603.png)

### React-redux的使用

```tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "antd/dist/antd.css";
import "./i18n/configs";
import { Provider } from "react-redux";
import rootStore from "./redux/store";
import axios from "axios";
import { PersistGate } from "redux-persist/integration/react";

axios.defaults.headers["x-icode"] = "FB80558A73FA658E";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={rootStore.store}>
      <PersistGate persistor={rootStore.persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

```

#### 在类组件中使用

使用connect高阶组件

```tsx
import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import store, { RootState } from "../../redux/store";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  addLanguageActionCreator,
  changeLanguageActionCreator,
} from "../../redux/language/languageActions";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import getStoredState from "redux-persist/es/getStoredState";

const mapStateToProps = (state: RootState) => {
  return {
    language: state.language.language,
    languageList: state.language.languageList,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeLanguage: (code: "zh" | "en") => {
      const action = changeLanguageActionCreator(code);
      dispatch(action);
    },
    addLanguage: (name: string, code: string) => {
      const action = addLanguageActionCreator(name, code);
      dispatch(action);
    },
  };
};

type PropsType = RouteComponentProps & // react-router 路由props类型
  WithTranslation & // i18n props类型
  ReturnType<typeof mapStateToProps> & // redux store 映射类型
  ReturnType<typeof mapDispatchToProps>; // redux dispatch 映射类型

class HeaderComponent extends React.Component<PropsType> {
  // 获取store里面的state，这种方式非常复杂，也不利于维护，我们可以将其改造为函数式组件 —— Header.tsx
  // constructor(props) {
  //   super(props);
  //   const storeState = store.getState();
  //   this.state = {
  //     language: storeState.language,
  //     languageList: storeState.languageList,
  //   };

  //   组件监听store变化
  //   store.subScribe(this.handleStoreChange)
  // }

  // handleStoreChange = () => {
  //   const storeState = store.getState();
  //   this.setState({
  //     language: getStoredState.language,
  //   });
  // };

  menuClickHandler = (e) => {
    console.log(e);
    if (e.key === "new") {
      // 处理新语言添加action
      this.props.addLanguage("新语言", "new_lang");
    } else {
      this.props.changeLanguage(e.key);
    }
  };

  render() {
    const { history, t, languageList, language } = this.props;
    return (
      <div className={styles["app-header"]}>
        {/* top-header */}
        <div className={styles["top-header"]}>
          <div className={styles.inner}>
            <Typography.Text>{t("header.slogan")}</Typography.Text>
            {/* 语言切换功能 */}
            <Dropdown.Button
              style={{ marginLeft: 15 }}
              overlay={
                <Menu onClick={this.menuClickHandler}>
                  {languageList.map((l) => {
                    return <Menu.Item key={l.code}>{l.name}</Menu.Item>;
                  })}
                  {/* 添加新语言 */}
                  <Menu.Item key={"new"}>
                    {t("header.add_new_language")}
                  </Menu.Item>
                </Menu>
              }
              icon={<GlobalOutlined />}
            >
              {language === "zh" ? "中文" : "English"}
            </Dropdown.Button>
            <Button.Group className={styles["button-group"]}>
              <Button onClick={() => history.push("register")}>
                {t("header.register")}
              </Button>
              <Button onClick={() => history.push("signIn")}>
                {t("header.signin")}
              </Button>
            </Button.Group>
          </div>
        </div>
        <Layout.Header className={styles["main-header"]}>
          <span onClick={() => history.push("/")}>
            <img src={logo} alt="logo" className={styles["App-logo"]} />
            <Typography.Title level={3} className={styles.title}>
              {t("header.title")}
            </Typography.Title>
          </span>
          <Input.Search
            placeholder={"请输入旅游目的地、主题、或关键字"}
            className={styles["search-input"]}
          />
        </Layout.Header>
        <Menu mode={"horizontal"} className={styles["main-menu"]}>
          <Menu.Item key="1"> {t("header.home_page")} </Menu.Item>
          <Menu.Item key="2"> {t("header.weekend")} </Menu.Item>
          <Menu.Item key="3"> {t("header.group")} </Menu.Item>
          <Menu.Item key="4"> {t("header.backpack")} </Menu.Item>
          <Menu.Item key="5"> {t("header.private")} </Menu.Item>
          <Menu.Item key="6"> {t("header.cruise")} </Menu.Item>
          <Menu.Item key="7"> {t("header.hotel")} </Menu.Item>
          <Menu.Item key="8"> {t("header.local")} </Menu.Item>
          <Menu.Item key="9"> {t("header.theme")} </Menu.Item>
          <Menu.Item key="10"> {t("header.custom")} </Menu.Item>
          <Menu.Item key="11"> {t("header.study")} </Menu.Item>
          <Menu.Item key="12"> {t("header.visa")} </Menu.Item>
          <Menu.Item key="13"> {t("header.enterprise")} </Menu.Item>
          <Menu.Item key="14"> {t("header.high_end")} </Menu.Item>
          <Menu.Item key="15"> {t("header.outdoor")} </Menu.Item>
          <Menu.Item key="16"> {t("header.insurance")} </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(HeaderComponent)));

```

这样的复杂代码结构使得使用redux变得不那么优雅了，于是就有了下面的用法：

![image-20211130200635622](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130200635622.png)

```tsx
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
  LanguageActionTypes,
  addLanguageActionCreator,
  changeLanguageActionCreator,
} from "../../redux/language/languageActions";
import { useTranslation } from "react-i18next";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { userSlice } from "../../redux/user/slice";

interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

export const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const match = useRouteMatch();

  // useSelector 可以帮助我们连接store里面的数据
  // const language = useSelector((state: RootState) => state.language.language);
  /**
   * 这里我们每次使用 useSelector 都要从 store.ts 中去导入RootState类型定义，这将使得我们的组件与store绑定起来了，而
   * 组件与state的绑定会使得这个组件与state深度耦合，无法再被复用，这显然不是我们乐见的。这时候，我们就需要将RootState
   * 从组件中提取出来。基本的方法是使用 TypedUseSelectorHook 这个interface来使我们的store类型重新定义。
   *
   * 在hoohs.ts中重新定义了useSelector这个hooks，这样我们就不需要在每次使用的时候都去再重新定义一遍state的类型。
   */
  const language = useSelector((state) => state.language.language);
  const languageList = useSelector((state) => state.language.languageList);

  // dispatch函数分发事件
  // const dispatch = useDispatch<Dispatch<LanguageActionTypes>>();   虽然这样定义看起来更严谨，但实际上没有必要，破坏了灵活性。
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const jwt = useSelector((s) => s.user.token);
  const [username, setUsername] = useState("");

  const shoppingCartItems = useSelector((s) => s.shoppingCart.items);
  const shoppingCartLoading = useSelector((s) => s.shoppingCart.loading);

  useEffect(() => {
    if (jwt) {
      const token = jwt_decode<JwtPayload>(jwt);
      setUsername(token.username);
    }
  }, [jwt]);

  const menuClickHandler = (e) => {
    console.log(e);
    if (e.key === "new") {
      // 处理新语言添加action
      dispatch(addLanguageActionCreator("新语言", "new_lang"));
    } else {
      dispatch(changeLanguageActionCreator(e.key));
    }
  };

  const onLogout = () => {
    dispatch(userSlice.actions.logOut());
    history.push("/");
  };

  return (
    <div className={styles["app-header"]}>
      {/* top-header */}
      <div className={styles["top-header"]}>
        <div className={styles.inner}>
          <Typography.Text>{t("header.slogan")}</Typography.Text>
          {/* 切换网站语言 */}
          <Dropdown.Button
            style={{ marginLeft: 15 }}
            overlay={
              <Menu onClick={menuClickHandler}>
                {languageList.map((l) => {
                  return <Menu.Item key={l.code}>{l.name}</Menu.Item>;
                })}
                <Menu.Item key={"new"}>
                  {t("header.add_new_language")}
                </Menu.Item>
              </Menu>
            }
            icon={<GlobalOutlined />}
          >
            {language === "zh" ? "中文" : "English"}
          </Dropdown.Button>
          {jwt ? (
            <Button.Group className={styles["button-group"]}>
              <span>
                {t("header.welcome")}
                <Typography.Text strong>{username}</Typography.Text>
              </span>
              <Button
                loading={shoppingCartLoading}
                onClick={() => history.push("/shoppingCart")}
              >
                {t("header.shoppingCart")}({shoppingCartItems.length})
              </Button>
              <Button onClick={onLogout}>{t("header.signOut")}</Button>
            </Button.Group>
          ) : (
            <Button.Group className={styles["button-group"]}>
              <Button onClick={() => history.push("/register")}>
                {t("header.register")}
              </Button>
              <Button onClick={() => history.push("/signIn")}>
                {t("header.signin")}
              </Button>
            </Button.Group>
          )}
        </div>
      </div>
      <Layout.Header className={styles["main-header"]}>
        <span onClick={() => history.push("/")}>
          <img src={logo} alt="logo" className={styles["App-logo"]} />
          <Typography.Title level={3} className={styles.title}>
            {t("header.title")}
          </Typography.Title>
        </span>
        <Input.Search
          placeholder={"请输入旅游目的地、主题、或关键字"}
          className={styles["search-input"]}
          onSearch={(keywords) => history.push("/search/" + keywords)}
        />
      </Layout.Header>
      <Menu mode={"horizontal"} className={styles["main-menu"]}>
        <Menu.Item key="1"> {t("header.home_page")} </Menu.Item>
        <Menu.Item key="2"> {t("header.weekend")} </Menu.Item>
        <Menu.Item key="3"> {t("header.group")} </Menu.Item>
        <Menu.Item key="4"> {t("header.backpack")} </Menu.Item>
        <Menu.Item key="5"> {t("header.private")} </Menu.Item>
        <Menu.Item key="6"> {t("header.cruise")} </Menu.Item>
        <Menu.Item key="7"> {t("header.hotel")} </Menu.Item>
        <Menu.Item key="8"> {t("header.local")} </Menu.Item>
        <Menu.Item key="9"> {t("header.theme")} </Menu.Item>
        <Menu.Item key="10"> {t("header.custom")} </Menu.Item>
        <Menu.Item key="11"> {t("header.study")} </Menu.Item>
        <Menu.Item key="12"> {t("header.visa")} </Menu.Item>
        <Menu.Item key="13"> {t("header.enterprise")} </Menu.Item>
        <Menu.Item key="14"> {t("header.high_end")} </Menu.Item>
        <Menu.Item key="15"> {t("header.outdoor")} </Menu.Item>
        <Menu.Item key="16"> {t("header.insurance")} </Menu.Item>
      </Menu>
    </div>
  );
};

```

这样，redux的模块化使用，使得redux变得非常清晰易用。

## redux 进阶

### RESTful API

![image-20211130203223212](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203223212.png)

![image-20211130203254990](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203254990.png)

![image-20211130203349478](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203349478.png)

![](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203402933.png)

![image-20211130203437141](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203437141.png)



![image-20211130203505368](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203505368.png)

### 中间件

处理接口请求——redux-thunk

![image-20211130203832300](https://gitee.com/ian_kevin126/picturebed/raw/master/windows/img/image-20211130203832300.png)









