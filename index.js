const validator = require("validator")
const readline = require("readline");
const { log } = require("console");
const rl = readline.createInterface({input: process.stdin, output: process.stdout})

rl.question("Your name? ", (name) => {
    rl.question("Your phone number: ", (mobile) => {
        rl.question("Your email:", (email) => {

            const isMobileValid = validator.isMobilePhone(mobile, "id-ID")
            const isEmailValid = validator.isEmail(email)

            console.log(`Name : ${name}`);
            console.log(`Mobile : ${mobile} ${isMobileValid ? valid : invalid}`)
            console.log(`Email: ${isEmailValid ? valid : invalid}`);
            
            

        })

    })

})

