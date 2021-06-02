---
exclude_from_search: false
layout: article
title: "Shiny App"
categories: app-development
tags: [integrations, app-development]
permalink:
   /integrations/shiny
show_related: false
author: steph_kim
excerpt: "Call Fourier Detrend algorithm in your Shiny app!"
excerpt-short: "Call machine learning algorithms directly from R Shiny."

image:
    teaser: /language_logos/rstudio.svg
github: https://github.com/algorithmiaio/sample-apps/tree/master/shiny-r/fourier-detrend-example
redirect_from:
  - /tutorials/sample-apps/shiny-app
---

The full sample code can be found in the GitHub repo: <a href="https://github.com/algorithmiaio/sample-apps/tree/master/shiny-r/fourier-detrend-example" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> FORK</a>

Before you get started with this Shiny sample app, check out our <a href="{{site.baseurl}}/clients/r">Algorithmia R language Client</a> and when you want to work with your own data, read up on [Algorithmia's Data Portal](/data), which offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

Here's a basic example of how to call an algorithm via our REST API inside a Shiny app, which updates the UI based on the API call and check out the example on <a href="https://algorithmia.shinyapps.io/fourier-deseasonality/">shinyapps.io</a>:


{% include toc.html %}

{% highlight R %}
#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(ggplot2)
library(algorithmia)

# Define UI for application that draws a histogram
ui <- fluidPage(
   
   # Application title
   titlePanel("NY Births with Fourier Detrend"),
   
   # Sidebar with a slider input for number of bins 
   sidebarLayout(
      sidebarPanel(
         sliderInput("bins",
                     "K strongest frequencies:",
                     min = 1,
                     max = 10,
                     value = 2)
      ),
      
      # Show a plot of the generated distribution
      mainPanel(
         plotOutput("distPlot")
      )
   )
)

fourier_detrend <- function(x) {
  client <- getAlgorithmiaClient("YOUR_API_KEY")
  algo <- client$algo("TimeSeries/FourierDetrend/0.1.0")
  result <- algo$pipe(x)$result
}

# Define server logic required to draw plot
server <- function(input, output) {
  births <- scan("http://robjhyndman.com/tsdldata/data/nybirths.dat")
  # Update the plot based on UI slider
  update_plot = reactive({
    data_input <- list(as.list(births), input$bins)
    return(unlist(fourier_detrend(data_input)))
  })
  
   output$distPlot <- renderPlot({
     detrend_data <- update_plot()
     dbl <- ts(detrend_data, frequency=12, start=c(1946,1))
     autoplot(dbl, ts.colour = "#00B8D4")
   })
}

# Run the application 
shinyApp(ui = ui, server = server)

{% endhighlight %}
