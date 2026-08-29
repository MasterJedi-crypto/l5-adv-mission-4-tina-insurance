# full interview against the API with  answers


param(
  [string]$JobTitle  = "Barista",
  [string]$BaseUrl   = "http://localhost:3000",
  [ValidateSet("standard", "vague", "rich")]
  [string]$AnswerSet = "standard"
)

$answerSets = @{
  # Neutral, role-agnostic. comparing across job titles.
  standard = @(
    "I've worked in this area for about two years and I enjoy working with people.",
    "My main strength is staying calm when things get busy.",
    "We were short staffed on a really busy day once and I had to decide what mattered most.",
    "I handle pressure by focusing on one thing at a time and asking for help early.",
    "I made a mistake with an order once and I owned up to it straight away.",
    "I keep learning by asking questions and watching people who are better than me."
  )

  # Deliberately thin. Tests whether the interviewer probes the gaps.
  vague = @(
    "I'm a hard worker and a people person.",
    "I'm good at most things really.",
    "Yeah I've dealt with stuff like that before.",
    "I just get on with it.",
    "Not really, I don't make many mistakes.",
    "I learn as I go."
  )

  # Detailed and specific. Tests whether it builds on real content.
  rich = @(
    "I spent two years at a busy cafe doing 200 covers a morning, mostly on the espresso machine, and I trained two new starters.",
    "My strength is triage under pressure. On a Saturday rush I'll batch similar drinks and call ahead to the till so nothing stalls.",
    "Our grinder died mid-rush. I switched to the backup, recalibrated in about four minutes, and comped the three drinks that came out wrong.",
    "I keep a written prep list so nothing depends on memory when it gets loud, and I flag problems before they become emergencies.",
    "I once served a dairy drink to someone who'd asked for oat. I stopped them before they drank it, remade it, and we changed how we labelled cups.",
    "I read James Hoffmann, I cup new beans when the roaster sends samples, and I ask our roaster rep questions every delivery."
  )
}

$answers = $answerSets[$AnswerSet]

$history = @(
  @{ role = "interviewer"; text = "Tell me about yourself" }
)

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host " $JobTitle   (answers: $AnswerSet)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Q1: Tell me about yourself" -ForegroundColor Green

for ($i = 0; $i -lt $answers.Count; $i++) {
  Write-Host ""
  Write-Host "A$($i + 1): $($answers[$i])" -ForegroundColor DarkGray

  $history += @{ role = "user"; text = $answers[$i] }

  $body = @{ jobTitle = $JobTitle; history = $history } | ConvertTo-Json -Depth 6

  try {
    $res = Invoke-RestMethod -Uri "$BaseUrl/api/interview" `
                             -Method Post `
                             -Body $body `
                             -ContentType "application/json"
  }
  catch {
    Write-Host ""
    Write-Host "REQUEST FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check the terminal running npm run dev for the real error." -ForegroundColor Red
    return
  }

  if ($res.isComplete) {
    Write-Host ""
    Write-Host "--------------------- FEEDBACK ------------------------" -ForegroundColor Yellow
    Write-Host $res.reply
    Write-Host "-------------------------------------------------------" -ForegroundColor Yellow
  }
  else {
    Write-Host ""
    Write-Host "Q$($res.questionNumber): $($res.reply)" -ForegroundColor Green
  }

  $history += @{ role = "interviewer"; text = $res.reply }

  Start-Sleep -Milliseconds 500   # be kind to the free tier
}

Write-Host ""