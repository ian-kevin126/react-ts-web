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
