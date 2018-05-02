package main

import (
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func upload(c echo.Context) error {
	// Read form fields
	name := c.FormValue("name")
	email := c.FormValue("email")

	form, err := c.MultipartForm()
	if err != nil {
		return err
	}

	for k, v := range form.File {
		log.Println(k)
		if err := createFile(v[0]); err != nil {
			log.Println(err)
		}
	}

	//-----------
	// Read file
	//-----------

	// Source

	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s uploaded successfully with fields name=%s and email=%s.</p>", name, email))
}

func main() {
	e := echo.New()

	e.Debug = true
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/", "public")
	e.POST("/upload", upload)

	e.Logger.Fatal(e.Start(":5000"))
}

func createFile(fileHeader *multipart.FileHeader) error {
	src, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create("/tmp/" + fileHeader.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	return nil
}
