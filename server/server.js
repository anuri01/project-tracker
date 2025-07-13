//라이브러리 로드
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 인증 미들웨어 (수정됨) ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) { // 'startWith' -> 'startsWith'
        return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // 'decode' -> 'decoded'
        req.user = { id: decoded.id, username: decoded.username };
        next();
    } catch (error) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3000;

//미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 데이터베이스 연결 ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
  .catch(err => console.error('MongoDB 연결 오류:', err));

// --- 모델(데이터 구조) 정의 ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
    content: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

// save 메서드가 실행되기 전(pre)에 비밀번호를 암호화하는 로직 (수정됨)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // next를 함수로 호출
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); // 성공 후 다음 단계로 진행
    } catch (error) {
        next(error);
    }
});

const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

// --- API 라우트(경로) 설정 ---
app.get('/api/projects', authMiddleware, async (req, res) => {
    try {
        // 자신의 프로젝트만 찾도록 수정
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: '프로젝트 이름은 필수입니다.' });
    }
    const newProject = new Project({ name, description, user: req.user.id });
    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// ... (다른 프로젝트 및 Task 관련 라우트들) ...
app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
    try {
         const deleteProject = await Project.findByIdAndDelete(req.params.id);
         if(!deleteProject) {
            return res.status(404).json({message: '프로젝트를 찾을 수 없습니다.'});
         }
         res.json({message: '삭제가 완료 됐어요.'});

    } catch(err) {
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({message: '제목은 필수 입력항목 입니다.'});
        }
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true } 
        );
        if (!updatedProject) {
            return res.status(404).json({message: '프로젝트를 찾을 수 없습니다.'});
        }
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

app.get('/api/projects/:projectId/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: 1 });
        res.json(tasks);
    } catch(err) {
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

app.post('/api/projects/:projectId/tasks', authMiddleware, async (req, res) => {
    const { content } = req.body;
    if(!content) {
        return res.status(400).json({ message: '작업 내용은 필수입니다.'});
    }

    const newTask = new Task({
        content: content,
        project: req.params.projectId
    });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: '서버 오류가 발생했습니다' });
    }
});

app.patch('/api/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { isCompleted } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { isCompleted },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({message: '작업을 찾을 수 없습니다.'});
        }
        res.json(updatedTask);
    } catch (err) {
        console.error('!!! Task 업데이트 중 에러 발생 !!!', err);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

app.delete('/api/tasks/:taskId', authMiddleware, async(req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
        if(!deletedTask) {
            return res.status(404).json({message: '삭제할 작업을 찾을 수 없습니다.'});
        }
        res.json({message: '작업이 정상적으로 삭제됐습니다.'});
    } catch (err) {
        console.error("!!! Task 삭제 중 에러 발생", err);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

// --- 사용자(User) API 라우트 ---
app.post('/api/users/signup', async(req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({message:'사용자 이름과 비밀번호는 필수 사항입니다.'});
        }
        const existingUser = await User.findOne({username: username});
        if(existingUser) {
            return res.status(400).json({message: '이미 사용중인 이름입니다.'});
        }
        const newUser = new User({username, password});
        await newUser.save();
        res.status(201).json({message: '회원가입이 성공적으로 완료되었습니다.'});
    } catch (error) {
        console.error('!!! 회원 가입 중 에러 발생 !!!', error);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message: '사용자 정보가 올바르지 않습니다.'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message:'사용자 정보가 올바르지 않습니다.'});
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({token, message:'로그인에 성공했습니다.'});
    } catch (error) {
        console.error("!!! 로그인 중 에러 발생 !!!", error);
        res.status(500).json({message: '서버 오류가 발생했습니다.'});
    }
});

app.get('/api/users/me', authMiddleware, async (req, res) => {
 try {
        // authMiddleware가 req.user에 넣어준 정보로 DB에서 사용자를 찾습니다.
        const user = await User.findById(req.user.id).select('-password'); // 비밀번호는 제외하고 선택
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 비밀번호 변경
app.put('/api/users/password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: '기존 비밀번호와 새 비밀번호를 모두 입력해야 합니다.' });
        }

        // 1. 사용자 정보 찾기
        const user = await User.findById(req.user.id);

        // 2. 기존 비밀번호가 맞는지 확인
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '기존 비밀번호가 일치하지 않습니다.' });
        }

        // 3. 새 비밀번호로 업데이트하고 저장 (pre-save 훅이 여기서도 동작합니다)
        user.password = newPassword;
        await user.save();

        res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });

    } catch (error) {
        console.error('!!! 비밀번호 변경 중 에러 발생 !!!', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});