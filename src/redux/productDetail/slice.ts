import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductDetailState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: ProductDetailState = {
  loading: true,
  error: null,
  data: null,
};

// 可以在RTK中处理api请求
export const getProductDetail = createAsyncThunk(
  "productDetail/getProductDetail",
  async (touristRouteId: string, thunkAPI) => {
    // thunkAPI.dispatch(productDetailSlice.actions.fetchStart());
    // try {
    //   const { data } = await axios.get(
    //     `http://123.56.149.216:8080/api/touristRoutes/${touristRouteId}`
    //   );
    //   thunkAPI.dispatch(productDetailSlice.actions.fetchSuccess(data));
    // } catch (error) {
    //   thunkAPI.dispatch(productDetailSlice.actions.fetchFail(error.message));
    // }

    // 上面的写法是没有返回值的，更简洁的方式是我们在extraReducers中处理api的状态，通过RTk自动帮我们实现映射
    const { data } = await axios.get(
      `http://123.56.149.216:8080/api/touristRoutes/${touristRouteId}`
    );
    return data;
  }
);

export const productDetailSlice = createSlice({
  // slice的命名空间
  name: "productDetail",
  // 初始化数据
  initialState,
  // 这里的reducers实际上是把reducer和action捆绑在一起了，我们不需要再定义action了。这里的reducers是一个对象，每个对象对应着一个action，也对应着这个action的处理函数。
  // 因为slice本身就是面向对象而不是面向过程的，所以我们不需要再写Switch语句了。
  reducers: {
    fetchStart: (state) => {
      // return {...state,loading: true};
      // 由于 immer 的引入，我们可以不再像以前那样返回一个旧对象组装成的新对象，而可以直接操作对象
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchFail: (state, action: PayloadAction<string | null>) => {
      const ddd = action.payload;
      state.error = action.payload;
      state.loading = false;
    },
  },
  // 使用createAsyncThunk处理api请求之后，我们就可以使用extraReducers来处理接口请求了，将使得api请求完全抽离到redux中
  extraReducers: {
    [getProductDetail.pending.type]: (state) => {
      // return { ...state, loading: true };
      state.loading = true;
    },
    [getProductDetail.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getProductDetail.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      //   const ddd = action.payload;
      state.loading = false;
      state.error = action.payload;
    },
  },
});
