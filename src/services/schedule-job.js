import loggers from './logger';
import repositories from '../repositories';
import userController from '../controllers/user-controller';

const { errorLogger } = loggers;
const { mediaRepository,gmailRepository } = repositories;

export default {
    /**
     * test schedule
     */
    async test() {
        try {

            // await mediaRepository.test();
        } catch (error) {
            errorLogger.error(JSON.stringify(error));
        }
    },
    /**
     * delete media schedule
     */
    async deleteMedia() {
        try {
            await mediaRepository.findAllAndRemove();
        } catch (error) {
            errorLogger.error(JSON.stringify(error));
        }
    },

    /**
     * delete user Object
     */
    async deleteUserRepoDict() {
        try {
            await userController.at12AM();
        } catch (error) {
            errorLogger.error(JSON.stringify(error));
        }
    },

    /**
     * delete media schedule
     */
    async getUnreadEmails() {
        try {
            console.log("Triggered");
            await gmailRepository.getUnreadEmails();
            console.log("Triggered End");
        } catch (error) {
            errorLogger.error(JSON.stringify(error));
        }
    }
};
