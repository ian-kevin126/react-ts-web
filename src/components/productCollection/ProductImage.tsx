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
