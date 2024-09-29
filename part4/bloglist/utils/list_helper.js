const dummy = (blogs) => {
    return (!blogs) ?  1 :  1
}

const totalLikes = (blogs) => {
    if(!blogs || blogs.length === 0) {
        return 0
    } else {
        const sum = blogs.reduce (
            (accummulator, currentValue) => accummulator + (currentValue.likes || 0), 0 ,
        )
        
        return sum
    }
}

const favouriteBlog = (blogs) => {
    if(!blogs || blogs.length === 0) {
        return {}
    } else {
        const mostLikedBlog = blogs.reduce((max, blog) => {
        return blog.likes > max.likes ? blog : max
       })
       return mostLikedBlog
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}