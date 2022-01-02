const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const notArray = {
  author: 'no',
  data: 'array'
}

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of many is correct', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })

  test('of one blog entry in array is correct', () => {
    const oneBlog = [blogs[0]]
    expect(listHelper.totalLikes(oneBlog)).toBe(7)
  })

  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of not an array to be undefined', () => {
    expect(listHelper.totalLikes(notArray)).toBe(undefined)
  })
})

describe('favorite', () => {
  test('has the correct amount of likes', () => {
    expect(listHelper.favoriteBlog(blogs).likes).toBe(12)
  })

  test('matches the most liked and is in correct format', () => {
    const mostLiked = {
      title: blogs[2].title,
      author: blogs[2].author,
      likes: blogs[2].likes,
    }
    expect(listHelper.favoriteBlog(blogs)).toEqual(mostLiked)
  })

  test('of one blog entry in array is correct', () => {
    const oneBlog = [blogs[3]]
    const correctResult = {
      title: blogs[3].title,
      author: blogs[3].author,
      likes: blogs[3].likes,
    }
    expect(listHelper.favoriteBlog(oneBlog)).toEqual(correctResult)
  })

  test('does not accept non-arrays', () => {
    expect(listHelper.favoriteBlog(notArray)).toBe(undefined)
  })
})

describe('most blogs', () => {
  test('gets the correct result with many in the right format', () => {
    const correctResult = 
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    expect(listHelper.mostBlogs(blogs)).toEqual(correctResult)
  })

  test('correct result with one in the right format', () => {
    const oneBlog = [blogs[1]]
    const correctResult = {
      author: "Edsger W. Dijkstra",
      blogs: 1
    }
    expect(listHelper.mostBlogs(oneBlog)).toEqual(correctResult)
  })

  test('does not accept empty arrays', () => {
    expect(listHelper.mostBlogs([])).toBe(undefined)
  })

  test('does not accept non-arrays', () => {
    expect(listHelper.mostBlogs(notArray)).toBe(undefined)
  })
})

describe('most likes', () => {
  test('gets the correct result with many in the right format', () => {
    const correctResult={
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    expect(listHelper.mostLikes(blogs)).toEqual(correctResult)
  })

  test('gets the correct result with one in the right format', () => {
    const oneBlog = [blogs[0]]
    const correctResult={
      author: "Michael Chan",
      likes: 7
    }
    expect(listHelper.mostLikes(oneBlog)).toEqual(correctResult)
  })

  test('does not accept empty arrays', () => {
    expect(listHelper.mostLikes([])).toBe(undefined)
  })

  test('does not accept non-arrays', () => {
   expect(listHelper.mostLikes(notArray)).toBe(undefined)
  })
})
