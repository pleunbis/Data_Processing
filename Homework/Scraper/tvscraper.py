#!/usr/bin/env python
# Name: Pleun Bisseling
# Student number: 10591249
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    This function extracts a list of highest rated TV series from IMDB.
    The list contains the following: TV Title, Rating, Genre, Actors, Runtime
    """

    # Pseudo code

    # tvshows = all tv serie blocks
    # results = []
    # for tvshow in tvshows:
        # tvshowslist.append(title, rating, genre, actor, runtime)

    # TV Serie Block
    # print(dom.find_all('div', 'lister-item mode-advanced'))

    # Title
    # print(dom.find_all('h3', 'lister-item-header'))

    # Rating
    # print(dom.find_all('div', 'inline-block ratings-imdb-rating'))

    # Genre
    # print(dom.find_all('span', 'genre'))

    # Actors
    # print(dom.find_all('p', ' '))

    # Runtime
    # print(dom.find_all('span', 'runtime'))

    #return results   # REPLACE THIS LINE AS WELL AS APPROPRIATE
    return []

    # loop through list of tvseries




def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    writer.writerows(tvseries)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)