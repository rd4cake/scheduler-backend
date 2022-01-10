

export default class authCheck{
    static enureAuth(req, res ,next){
        if (req.isAuthenticated()){
            console.log("bruh")
            return next()
        }
        else
        {
            console.log("not authorized")
        }
    }
    static guestAuth(req, res ,next){
        if (req.isAuthenticated()){
            console.log("bruh")
            return next()
        }
        else
        {
            console.log("not authorized")
        }
    }
}