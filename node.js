const express = require("express");
const fs = require("fs");
const path = require("path");

const multer = require("multer");
// multer 설정
const upload = multer({
    storage: multer.diskStorage({
        // 저장할 장소
        destination(req, file, cb) {
            try {
                const { project, folder } = req.query;
                cb(null, `public/${project}/${folder}`);
            } catch {
                return;
            }
        },
        // 저장할 이미지의 파일명
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); // 파일의 확장자

            // 파일이름 + 현재시간밀리초 + 파일확장자명
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});
const cors = require("cors");

const app = express();

app.use(cors()); // 우선 cors 무조곤 허용

// 하나의 이미지 파일만 가져온다.
app.post("/upload", upload.single("userfile"), (req, res) => {
    // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
    // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
    console.log("전달받은 파일", req.file);
    console.log("저장된 파일의 이름", req.file.filename);

    try {
        const { project, folder } = req.query;
        // 파일이 저장된 경로를 클라이언트에게 반환해준다.
        const IMG_URL = `http://localhost:3500/${project}/${folder}/${req.file.filename}`;
        console.log("new image url", IMG_URL);
        res.json({ url: IMG_URL });
    } catch {
        throw new Error("파일 저장 실패");
    }
});

// 미들웨어 사용
app.use(express.json()); // json 데이터 파서
app.use(express.urlencoded({ extended: false })); // 내부 url 파서 사용
app.use(express.static(path.join(__dirname + "/public"))); // 정적 파일 위치 설정

app.listen(3500, () => console.log(`Server started on port ${3500}`));
