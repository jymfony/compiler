const Class = require('./Class');
const ExpressionInterface = require('./ExpressionInterface');

class ClassExpression extends mix(Class, ExpressionInterface) {
}

module.exports = ClassExpression;
