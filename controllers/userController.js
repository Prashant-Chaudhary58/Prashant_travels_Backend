const User = require('../model/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    console.log('Register request received:', {
        body: req.body,
        headers: req.headers
    });
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    try {
        // Enhanced validation
        const validationErrors = [];
        
        if (!firstName?.trim()) validationErrors.push('First name is required');
        if (!lastName?.trim()) validationErrors.push('Last name is required');
        if (!email?.trim()) validationErrors.push('Email is required');
        if (!password) validationErrors.push('Password is required');
        
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors 
            });
        }

        // Enhanced password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long and contain both letters and numbers' 
            });
        }

        if (password !== confirmPassword) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Add email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Add password strength validation
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Email already exists:', email);
            return res.status(400).json({ error: 'Email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log('Creating user with data:', { 
            firstName, 
            lastName, 
            email,
            // Don't log the password
        });
        
        const newUser = await User.create({ 
            firstName,
            lastName,
            email,
            password: hashedPassword 
        });

        console.log('User created successfully:', newUser.id);
        
        // Return more detailed response
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        
        // Send appropriate error response
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                success: false,
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                error: 'An account with this email already exists'
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Registration failed. Please try again later.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Login an existing user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Enhanced validation
        if (!email?.trim() || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ where: { email: email.trim() } });
        
        // Generic error message for security
        const invalidCredentialsMessage = 'Invalid email or password';
        
        if (!user) {
            return res.status(401).json({ error: invalidCredentialsMessage });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: invalidCredentialsMessage });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345',
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', email);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { 
                id: user.id, 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName 
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed. Please try again later.' 
        });
    }
};

const getUser = async(req, res)=>{

    try{
        const tests = await User.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createUser = async(req, res)=>{
    
    try{
        
const {username, password} = req.body;

//Hash the password
const newtest = await User.create({username, password})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the password if it is being updated
        if (req.body.password) {
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        console.log('Fetching profile for user:', req.user.id);
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
        });

        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Profile fetched successfully');
        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch profile data' 
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { firstName, lastName, oldPassword, newPassword } = req.body;

        // Update name fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        // Handle password change if provided
        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            // Validate new password
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'New password must be at least 6 characters long' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = { 
    loginUser, 
    registerUser, 
    getUser, 
    updateUser,
    getUserProfile,
    updateProfile
};