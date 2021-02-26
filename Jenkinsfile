pipeline {
    agent any
    tools {nodejs "node"}

    environment {
        registry = "alxz26/devops" 
        registryCredential = 'dockerhub'
        dockerImage = ''
        branchName = ''
        version = ''
	}
    options {
        timestamps()
        skipDefaultCheckout()      // Don't checkout automatically
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }
        stage('Code Quality Check via SonarQube') 
        {
            agent any
            steps{
                script {
                    branchName = ""
                    if (!env.BRANCH_NAME.contains("main")) {
                        branchName = "-Dsonar.branch.name=${env.BRANCH_NAME}"
                    }
                 }                
                echo 'Quality Gate'  
                script {
                    def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv("SonarServer") {
                    sh """${tool("sonarqube")}/bin/sonar-scanner \
                    -Dsonar.projectKey=test-node-js \
                    -Dsonar.sources=. \
                    -Dsonar.css.node=. \
                    -Dsonar.host.url=http://192.168.100.17:9000 \
                    -Dsonar.login=2283b0c9d092de815f199e8b1bcde4113fb40c69"""
                    }
                }  
                sleep(30)               
                   timeout(time: 1, unit: 'MINUTES') { // Just in case something goes wrong, pipeline will be killed after a timeout
                    waitForQualityGate abortPipeline: true
                   }                 
            }
        }
        stage('Build') {
            agent {
		        docker {
                    image 'node:14.16.0-alpine3.12'
                    //args '-v /Users/gdelgadoh/.m2:/root/.m2' 
		        }
    		}  
            steps {
                echo "Valor para sonar.branch.name: ${branchName}"

                echo 'Compilar'
                sh 'npm install'
                echo 'Build'
            }
        }
        stage('Build Docker Image') { 
       		agent any
            steps {
            	script {

                    if ( env.BRANCH_NAME.equals("main") ) {

                        version = ":$BUILD_NUMBER"

                    } else {
                        version = ":" + env.BRANCH_NAME.replace("/", "-") + "-$BUILD_NUMBER"
                    }

                	dockerImageName = registry + version
                	dockerImage = docker.build "${dockerImageName}"
                	docker.withRegistry( '', registryCredential ) {
                		dockerImage.push()
                	}

                    if (env.BRANCH_NAME.equals("master")) {
                        docker.withRegistry( '', registryCredential ) {
                            dockerImage.push('latest')
                	    }
                        sh "docker rmi " + ${registry} + "latest"
                    }
                    sh "docker rmi $registry$version"	 
            	} 
            	
                	         
            }
        } 

    }
}