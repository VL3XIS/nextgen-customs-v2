import requests
import sys
import json

def scrape_top_posts(subreddit):
    """
    Scrapes the top 3 posts from a specified subreddit using Reddit's JSON API.
    """
    url = f"https://www.reddit.com/r/{subreddit}/top.json?limit=3"
    
    # Reddit requires a descriptive User-Agent to avoid 429/403 errors
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    print(f"Fetching top 3 posts from r/{subreddit}...")
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 404:
            print(f"Error: Subreddit 'r/{subreddit}' not found.")
            return
        elif response.status_code == 403:
            print(f"Error: Access forbidden (403). Reddit might be blocking requests.")
            return
        elif response.status_code != 200:
            print(f"Error: Failed to fetch data. Status code: {response.status_code}")
            return
            
        data = response.json()
        
        # Validate structure
        if 'data' not in data or 'children' not in data['data']:
            print("Error: Unexpected JSON structure.")
            return
            
        posts = data['data']['children']
        
        if not posts:
            print(f"No posts found in r/{subreddit}.")
            return
            
        print("\n=== TOP 3 POSTS ===")
        for i, post in enumerate(posts[:3], 1):
            p = post['data']
            print(f"\n{i}. {p.get('title', 'N/A')}")
            print(f"   Score: {p.get('score', 0)}")
            print(f"   Link: {p.get('url', 'N/A')}")
            print(f"   Comments: https://www.reddit.com{p.get('permalink', '')}")
            
    except Exception as e:
        print(f"An exception occurred: {e}")

if __name__ == "__main__":
    target_subreddit = "n8n"
    
    if len(sys.argv) > 1:
        target_subreddit = sys.argv[1]

    scrape_top_posts(target_subreddit) 
