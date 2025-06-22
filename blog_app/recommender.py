import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from .models import Blog, Rating, Destination, Hotel

def user_based_blog_recommendation(user_id, top_n=5):
    ratings_qs = Rating.objects.all().values('user_id', 'blog_id', 'rating')
    df = pd.DataFrame(ratings_qs)

    if df.empty or user_id not in df['user_id'].values:
        return Blog.objects.none()

    user_item_matrix = df.pivot(index='user_id', columns='blog_id', values='rating').fillna(0)
    sim_matrix = cosine_similarity(user_item_matrix)
    sim_df = pd.DataFrame(sim_matrix, index=user_item_matrix.index, columns=user_item_matrix.index)

    similar_users = sim_df[user_id].sort_values(ascending=False)[1:6]
    weighted_ratings = user_item_matrix.T.dot(similar_users) / similar_users.sum()
    unrated = user_item_matrix.loc[user_id] == 0
    recommendations = weighted_ratings[unrated].sort_values(ascending=False).head(top_n)

    return Blog.objects.filter(id__in=recommendations.index)

def recommend_by_destination(destination_id):
    dest = Destination.objects.get(id=destination_id)
    
    # Related destinations by tag
    all_dests = Destination.objects.exclude(id=destination_id)
    dest_df = pd.DataFrame(list(all_dests.values('id', 'tags'))).fillna('')
    dest_df['similarity'] = dest_df['tags'].apply(lambda t: len(set(t.split()) & set(dest.tags.split())))
    related_dests = dest_df.sort_values(by='similarity', ascending=False).head(3)
    
    # Hotels in the same location
    hotels = Hotel.objects.filter(location__icontains=dest.location)

    # Blogs mentioning this destination
    blogs = Blog.objects.filter(destination_name__icontains=dest.name)

    return {
        "related_destinations": Destination.objects.filter(id__in=related_dests['id'].tolist()),
        "hotels": hotels,
        "blogs": blogs
    }
