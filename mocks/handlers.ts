import { rest } from "msw"
import { setupWorker } from "msw"
import { products } from "./data"

export const handlers = [
  rest.get("/products", (req, res, ctx) => {
    console.log([...req.url.searchParams.keys()])
    // Check if the user is authenticated in this session

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: products,
      }),
    )
  }),
  rest.get("/product/:id", (req, res, ctx) => {
    console.log(req.params)
    const product = products.find((p) => p.id === parseFloat(req.params.id))
    if (!product) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          data: null,
        }),
      )
    }
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: product,
      }),
    )
  }),
]
export const worker = setupWorker(...handlers)
