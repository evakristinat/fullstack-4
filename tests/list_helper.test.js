const listHelper = require('../utils/list_helper')

const blogs = [
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


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
  test('of many is correct', () => {
    expect(listHelper.totalLikes(blogs)).toBe(12)
  })

  test('of one blog entry in array is correct', () => {
    const oneBlog = [blogs[0]]
    expect(listHelper.totalLikes(oneBlog)).toBe(10)
  })

  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of not an array to be undefined', () => {
    expect(listHelper.totalLikes({ likes: 100 })).toBe(undefined)
  })
})


describe('favorite', () => {
  test('has the correct amount of likes', () => {
    expect(listHelper.favoriteBlog(blogs).likes).toBe(10)
  })

  test('matches the most liked and is in correct form', () => {
    const mostLiked = {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    }
    expect(listHelper.favoriteBlog(blogs)).toEqual(mostLiked)
  })

  test('of one blog entry in array is correct', () => {
    const oneBlog = [blogs[2]]
    const correctResult = {
      title: blogs[2].title,
      author: blogs[2].author,
      likes: blogs[2].likes,
    }
    expect(listHelper.favoriteBlog(oneBlog)).toEqual(correctResult)
  })

  test('does not accept non-arrays', () => {
    const notArray = {}
    expect(listHelper.favoriteBlog(notArray)).toBe(undefined)
  })
})
