

const getImageUrl = (user: string) => {
   
    return new URL(`../assets/images/${user}.png`, import.meta.url).href
    // manageSystem\src\assets\images\user.png
}


export default getImageUrl;