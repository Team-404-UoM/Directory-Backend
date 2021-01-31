const HttpError = require('../models/httperror');
const Question = require('../models/questions');

const getQuestions = async(req, res, next) => {
    let questions = [];
    try {
        const cursor = await Question.aggregate([{ $sample: { size: 3 } }]);
        cursor.forEach((val)=> questions.push(val));
        res.send(questions);
    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not find data', 500
        );
        return next(err);
    }
}

const submitQuestions = async(req, res, next) => {
    /**
     * [
     *  {
     *      id: string,
     *      answer: string
     *  }
     * ]
     */
    const questions = req.body;

    try {s
        for(oneQuestion of questions){
            
            relatedQuestion = await Question.findById(oneQuestion.id);
            if(relatedQuestion.correct_answer !== oneQuestion.answer){
                res.status(401).send("Question is failed");
                return;
            }
        }
         
        res.status(200);
    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not find data', 500
        );
        return next(error);
    }
}


exports.getQuestions = getQuestions;
exports.submitQuestions = submitQuestions;