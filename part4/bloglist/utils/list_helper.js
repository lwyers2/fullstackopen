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

const mostBlogs = (blogs) => {
    if(!blogs || blogs.length === 0) {
        return {}
    } else {
        const blogCount = blogs.reduce((accummulator, blog) => {
            if(accummulator[blog.author]) {
                accummulator[blog.author]++
            } else {
                accummulator[blog.author] =1
            }
        return accummulator
        }, {})

        const blogInfo = Object.keys(blogCount).map(author => {
            return {
                author: author,
                blogs: blogCount[author]
            }
        })
        
        const mostBlogs = blogInfo.reduce((max, blog) => {
            return blog.blogs > max.blogs ? blog : max
        })

        return mostBlogs
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog, 
    mostBlogs
}