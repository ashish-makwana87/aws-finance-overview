import { error } from "../../utils/response.js"



export const adminOnlyMiddleware = async (event) => {
  

 if(event.user?.role !== 'admin') {

  return error("Forbidden: Admins only", 403)
 }

 return null
}