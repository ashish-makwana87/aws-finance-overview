import { ForbiddenError } from "../../utils/httpErrors.js"



export const adminOnlyMiddleware = async (event) => {
  

 if(event.user?.role !== 'admin') {

  throw new ForbiddenError("Forbidden: Admins only")
 }

 return null
}