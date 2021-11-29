/**
 * 声明css文件为模组化的文件，这样就可以以下面的方式导入
 * import styles from './index.css
 */

declare module "*.css" {
  const css: { [key: string]: string };
  export default css;
}
