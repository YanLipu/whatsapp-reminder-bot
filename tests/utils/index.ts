import { handler } from "../../src"

class UtilsTest {
  public async useHandler (): Promise<string> {
    try {
      const result = await handler() as string
      return result as string
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default new UtilsTest()
