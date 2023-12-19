import os
import openai
from flask import Flask, render_template, redirect, request, url_for

app = Flask(__name__)

app.static_folder = 'static'
openai.api_key = os.getenv("OPENAI_API_KEY")
prompt = []

@app.route("/", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        keyword = request.form["keyword"]
        sentence = f"Write a Short story in Korean on topic '{keyword}'."
        prompt.append({"role": "user", "content":sentence})
        response = openai.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = prompt,
            temperature = 0.6,
        )
        chat_response = response.choices[0].message.content
        return redirect(url_for("index", result = chat_response))

    result = request.args.get("result")
    return render_template("index.html", result = result)

if __name__ == '__main__':
    app.run(debug=True)