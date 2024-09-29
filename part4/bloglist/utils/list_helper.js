const dummy = (blogs) => {
    return (!blogs) ?  1 :  1
}

const totalLikes = (blogs) => {
    if(!blogs || blogs.length ===0) {
        return 0
    } else {
        const sum = blogs.reduce (
            (accummulator, currentValue) => accummulator + (currentValue.likes || 0), 0 ,
        )
        
        return sum
    }
}

module.exports = {
    dummy,
    totalLikes
}