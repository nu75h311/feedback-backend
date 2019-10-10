import { routesForUsersTests } from './RoutesForUsersTests';
import { routesForUserIdTests } from './RoutesForUserIdTests';

describe('/api/users', routesForUsersTests);
describe('/api/users/:userId', routesForUserIdTests);
