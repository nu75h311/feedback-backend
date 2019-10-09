import { routesForUsersTests } from './RoutesForUsers';
import { routesForUserIdTests } from './RoutesForUserId';

describe('/api/users', routesForUsersTests);
describe('/api/users/:userId', routesForUserIdTests);
