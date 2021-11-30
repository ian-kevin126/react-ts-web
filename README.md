# React + TypeScript + Web

## react-router 的使用

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

