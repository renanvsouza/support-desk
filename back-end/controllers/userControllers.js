const registerUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new Error('Please provide the username and password');
    }
    res.json(req.body);
}

const loginUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new Error('Please provide the username and password');
    }
    res.json(req.body);
}

module.exports = {
    registerUser,
    loginUser
}