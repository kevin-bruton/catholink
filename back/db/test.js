const db = require('./index')

describe('db', () => {
  let dbConn
  afterAll(() => {
    db.close()
  })
  it('should initialize the db connection with the catholink database', async () => {
    await db.open()
  })
  it('should be able to execute db queries', async () => {
    expect(db.connection).toBeTruthy()
  })
  it('can find users in the users collection with the connection', async () => {
    const found = await (await db.connection().collection('users').find({firstName: 'Kevin'})).toArray()
    console.log(found)
    expect(found).toHaveLength(1)
  })
  it('can find users accessing the users collection directly', async () => {
    const found = await (await db.users().find({firstName: 'Kevin'})).toArray()
    expect(found).toHaveLength(1)
  })
  it('can find users using a projection to limit the fields returned', async () => {
    const found = await (await db.users().find({firstName: 'Kevin'}).project({_id: 0, firstName: 1})).toArray()
    console.log(found)
    expect(found._id).toBeUndefined()
  })
})
