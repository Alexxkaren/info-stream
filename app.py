from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime, timedelta
import random

# Initialize Flask application and database
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'blablabla'  # Replace with a secure key in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

# Create tables in the database if they don't exist
with app.app_context():
    db.create_all()

# Define models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)

class BlacklistedToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), nullable=False, unique=True)
    blacklisted_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# Helper functions
def generate_token(user_id):
    """Generate JWT token with expiration."""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1) 
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorator to validate JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        if token.startswith('Bearer '):
            token = token[len('Bearer '):]

        # Check if the token is blacklisted
        blacklisted = BlacklistedToken.query.filter_by(token=token).first()
        if blacklisted:
            return jsonify({'message': 'Token has been revoked'}), 401

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(payload['user_id'])
            if not current_user:
                raise ValueError('User not found')
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError):
            return jsonify({'message': 'Invalid or expired token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Ensure the database is initialized and create the admin user if it doesn't exist
def initialize_db():
    """Check and create admin user if not exists."""
    with app.app_context():
        db.create_all()

        # Check and create the admin user if it does not exist
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            print("Creating default admin user...")
            admin_user = User(username='admin', role='admin')
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            db.session.commit()
            print("Admin user created.")

        # Check if there are no articles in the database
        if Article.query.count() == 0:
            print("Adding 25 real articles...")

            # Categories for articles
            categories = ['Technology', 'Science', 'Art', 'Health', 'Sports']

            # Real articles data
            real_articles = [
                {"title": "The Rise of AI in Everyday Life", "content": "Artificial Intelligence (AI) has transformed industries, from healthcare to transportation. Its integration into everyday tools like voice assistants and recommendation systems shows the potential of AI to simplify our lives.", "category": "Technology"},
                {"title": "Exploring the Mysteries of Black Holes", "content": "Black holes are fascinating celestial phenomena that challenge our understanding of physics. Recent discoveries, like the first image of a black hole, provide new insights into their nature.", "category": "Science"},
                {"title": "The Evolution of Abstract Art", "content": "Abstract art emerged as a revolutionary movement, breaking traditional boundaries. Artists like Kandinsky and Mondrian explored new forms of expression, influencing modern aesthetics.", "category": "Art"},
                {"title": "The Benefits of a Balanced Diet", "content": "A balanced diet is crucial for maintaining good health. Incorporating a variety of nutrients from fruits, vegetables, proteins, and whole grains can enhance energy levels and overall wellbeing.", "category": "Health"},
                {"title": "The Thrill of Extreme Sports", "content": "Extreme sports like rock climbing and skydiving offer adrenaline-packed adventures. These activities challenge physical limits and provide unique experiences.", "category": "Sports"},
                {"title": "Advancements in Renewable Energy", "content": "Renewable energy sources like solar and wind power are becoming more efficient and affordable. These technologies are key to reducing carbon emissions and combating climate change.", "category": "Technology"},
                {"title": "The Secrets of Ancient Civilizations", "content": "Archaeological discoveries continue to unveil the mysteries of ancient civilizations, from the pyramids of Egypt to the lost city of Machu Picchu.", "category": "History"},
                {"title": "Mental Health Awareness in the Modern Age", "content": "The stigma surrounding mental health is gradually being broken. Open conversations and better access to resources are helping more people seek support.", "category": "Health"},
                {"title": "The Art of Minimalist Living", "content": "Minimalism focuses on simplifying life by reducing possessions and focusing on essentials. It offers a path to a more meaningful and stress-free lifestyle.", "category": "Lifestyle"},
                {"title": "The Global Impact of Climate Change", "content": "Rising temperatures, melting glaciers, and extreme weather patterns highlight the urgency of addressing climate change on a global scale.", "category": "Environment"},
                {"title": "The Psychology of Motivation", "content": "Understanding what drives human behavior can help individuals achieve their goals. Motivation theories like intrinsic vs. extrinsic motivation offer valuable insights.", "category": "Psychology"},
                {"title": "The Golden Age of Television", "content": "High-quality storytelling and production have ushered in a golden age for television, with series like 'Breaking Bad' and 'Game of Thrones' setting new benchmarks.", "category": "Entertainment"},
                {"title": "Space Tourism: A New Frontier", "content": "With companies like SpaceX and Blue Origin, space tourism is no longer a dream but a reality. The implications for space exploration are immense.", "category": "Technology"},
                {"title": "The Role of Music in Cultural Identity", "content": "Music has always been a cornerstone of cultural expression, reflecting traditions, emotions, and societal changes.", "category": "Culture"},
                {"title": "The Importance of Financial Literacy", "content": "Understanding personal finance is crucial for managing debt, saving for the future, and achieving financial independence.", "category": "Finance"},
                {"title": "The Legacy of the Renaissance", "content": "The Renaissance period marked a cultural rebirth in Europe, with groundbreaking achievements in art, science, and philosophy.", "category": "History"},
                {"title": "The Science of Sleep", "content": "Sleep plays a vital role in physical and mental health. Research shows that quality sleep can boost memory, mood, and overall well-being.", "category": "Health"},
                {"title": "The World of Competitive Gaming", "content": "Esports has become a billion-dollar industry, with professional gamers competing in tournaments for global recognition and lucrative prizes.", "category": "Sports"},
                {"title": "The Impact of Social Media on Society", "content": "Social media platforms have transformed how people communicate and access information, but they also raise concerns about privacy and mental health.", "category": "Technology"},
                {"title": "Sustainable Fashion: A Growing Movement", "content": "The fashion industry is embracing sustainability, with initiatives focused on reducing waste, using eco-friendly materials, and promoting ethical labor practices.", "category": "Lifestyle"},
                {"title": "The Future of Electric Vehicles", "content": "Electric vehicles are revolutionizing the automotive industry, offering a cleaner and more efficient alternative to traditional gasoline-powered cars.", "category": "Technology"},
                {"title": "The Healing Power of Nature", "content": "Spending time in nature has proven benefits for mental health, reducing stress and enhancing overall happiness.", "category": "Health"},
                {"title": "The Origins of Modern Democracy", "content": "Modern democratic principles trace back to ancient Greece and Rome, where ideas of citizen participation and rule of law began to take shape.", "category": "History"},
                {"title": "The Influence of Social Movements", "content": "Social movements, from civil rights to climate activism, have played a crucial role in shaping modern societies and promoting justice.", "category": "Society"},
            ]


            # Add articles to the database
            for article in real_articles:
                new_article = Article(
                    title=article["title"],
                    content=article["content"],
                    category=article["category"]
                )
                db.session.add(new_article)

            db.session.commit()
            print("25 real articles added.")


# Define controllers (Blueprints)
main = Blueprint('main', __name__)

@main.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        token = generate_token(user.id)
        return jsonify({'token': token}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@main.route('/articles', methods=['GET'])
def articles():
    category = request.args.get('category')
    if category:
        articles = Article.query.filter_by(category=category).all()
    else:
        articles = Article.query.all()
    return jsonify({'articles': [{'id': article.id, 'title': article.title, 'category': article.category, 'content': article.content} for article in articles]}), 200

@main.route('/add_article', methods=['POST'])
@token_required
def add_article(current_user):
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    new_article = Article(title=data['title'], content=data['content'], category=data['category'])
    if not new_article.title or not new_article.content or not new_article.category:
        return jsonify({'message': 'Missing data'}), 400
    db.session.add(new_article)
    db.session.commit()
    return jsonify({'message': 'Article added successfully'}), 201

@main.route('/logout', methods=['POST'])
@token_required
def logout():
    token = request.headers.get('Authorization').split(" ")[1]  # Get the token part after "Bearer"
    blacklisted = BlacklistedToken(token=token)
    db.session.add(blacklisted)
    db.session.commit()
    return jsonify({'message': 'Logged out successfully'}), 200

@main.route('/delete_article/<int:article_id>', methods=['DELETE'])
@token_required
def delete_article(current_user, article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({'message': 'Article not found'}), 404
    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': 'Article deleted'}), 200
    

@main.route('/update_article/<int:article_id>', methods=['PUT'])
@token_required
def update_article(current_user, article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({'message': 'Article not found'}), 404
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    article.title = data.get('title', article.title)
    article.content = data.get('content', article.content)
    article.category = data.get('category', article.category)
    db.session.commit()
    return jsonify({'message': 'Article updated successfully'}), 200

# Register Blueprint
app.register_blueprint(main)

# Initialize the database and create the admin user
initialize_db()

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
